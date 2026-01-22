// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/_core/notification.ts
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";

// server/db.ts
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

// drizzle/schema.ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
var users = sqliteTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdateFn(() => /* @__PURE__ */ new Date()),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).notNull().$defaultFn(() => /* @__PURE__ */ new Date())
});
var actions = sqliteTable("actions", {
  id: text("id").primaryKey(),
  // e.g., "1.1", "2.3"
  title: text("title").notNull(),
  description: text("description").notNull(),
  deadline: text("deadline").notNull(),
  // YYYY-MM-DD format
  phase: text("phase").notNull(),
  // e.g., "phase1", "phase2"
  link: text("link"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdateFn(() => /* @__PURE__ */ new Date())
});
var userProgress = sqliteTable("user_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  actionId: text("actionId").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false).notNull(),
  completedAt: integer("completedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdateFn(() => /* @__PURE__ */ new Date())
});

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const sqlite = new Database(process.env.DATABASE_URL);
      _db = drizzle(sqlite);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function getAllActions() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return await db.select().from(actions).orderBy(actions.id);
}
async function seedActions(actionsList) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const existing = await db.select().from(actions).limit(1);
  if (existing.length > 0) {
    return;
  }
  await db.insert(actions).values(actionsList);
}
async function getUserProgress(userId) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
}
async function toggleActionCompletion(userId, actionId) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const existing = await db.select().from(userProgress).where(
    and(
      eq(userProgress.userId, userId),
      eq(userProgress.actionId, actionId)
    )
  ).limit(1);
  if (existing.length > 0) {
    const current = existing[0];
    const newCompleted = !current.completed;
    await db.update(userProgress).set({
      completed: newCompleted,
      completedAt: newCompleted ? /* @__PURE__ */ new Date() : null,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(userProgress.id, current.id));
    return newCompleted;
  } else {
    await db.insert(userProgress).values({
      userId,
      actionId,
      completed: true,
      completedAt: /* @__PURE__ */ new Date()
    });
    return true;
  }
}
async function getUserProgressStats(userId) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const [allActions, userProgressData] = await Promise.all([
    db.select().from(actions),
    db.select().from(userProgress).where(eq(userProgress.userId, userId))
  ]);
  const total = allActions.length;
  const completed = userProgressData.filter((p) => p.completed).length;
  const percentage = total > 0 ? Math.round(completed / total * 100) : 0;
  return {
    total,
    completed,
    percentage
  };
}

// client/src/lib/data.ts
var initialActions = [
  // PHASE 0: PRÉPARATION (Octobre - Décembre 2025)
  {
    id: "0.1",
    title: "Pr\xE9parer mon projet d'orientation",
    description: "Consulter Avenirs.onisep.fr et Parcoursup.gouv.fr pour r\xE9fl\xE9chir \xE0 ton projet.",
    deadline: "2025-12-01",
    status: "pending",
    phase: "phase0",
    link: "https://avenirs.onisep.fr"
  },
  {
    id: "0.2",
    title: "\xC9changer avec mon professeur principal",
    description: "Discuter de ton projet d'orientation avec ton professeur principal et les personnels d'orientation.",
    deadline: "2025-12-05",
    status: "pending",
    phase: "phase0"
  },
  {
    id: "0.3",
    title: "Participer \xE0 la 1re semaine d'orientation",
    description: "Assister aux r\xE9unions d'orientation au lyc\xE9e pour affiner ton projet.",
    deadline: "2025-12-10",
    status: "pending",
    phase: "phase0"
  },
  {
    id: "0.4",
    title: "Renseigner la fiche de dialogue",
    description: "Compl\xE9ter ta fiche de dialogue avant le 1er conseil de classe (d\xE9but d\xE9cembre).",
    deadline: "2025-12-05",
    status: "pending",
    phase: "phase0"
  },
  {
    id: "0.5",
    title: "Appeler le num\xE9ro vert Parcoursup",
    description: "Poser tes questions sur ton projet d'orientation. Num\xE9ro : 0 800 400 070 (lun-ven 10h-16h).",
    deadline: "2025-12-15",
    status: "pending",
    phase: "phase0",
    link: "https://www.parcoursup.gouv.fr"
  },
  // PHASE 1: DÉCOUVERTE (Décembre 2025 - Janvier 2026)
  {
    id: "1.1",
    title: "D\xE9couvrir la carte des formations",
    description: "\xC0 partir du 17 d\xE9cembre, consulter la carte des formations Parcoursup 2026.",
    deadline: "2025-12-17",
    status: "urgent",
    phase: "phase1",
    link: "https://www.parcoursup.gouv.fr"
  },
  {
    id: "1.2",
    title: "Lire les fiches de formation d\xE9taill\xE9es",
    description: "Pour chaque \xE9cole (Celsa, ISCOM, Sup de pub, DN Made, BUT, BTS), consulter les crit\xE8res d'admission, frais, d\xE9bouch\xE9s.",
    deadline: "2025-12-20",
    status: "pending",
    phase: "phase1",
    link: "https://www.parcoursup.gouv.fr"
  },
  {
    id: "1.3",
    title: "Consulter le profil des candidats admis",
    description: "V\xE9rifier les donn\xE9es sur le profil des candidats admis les ann\xE9es pr\xE9c\xE9dentes (s\xE9rie bac, niveau scolaire).",
    deadline: "2025-12-22",
    status: "pending",
    phase: "phase1"
  },
  {
    id: "1.4",
    title: "V\xE9rifier les frais de scolarit\xE9 et aides",
    description: "V\xE9rifier les frais de scolarit\xE9, \xE9ligibilit\xE9 aux bourses sur crit\xE8res sociaux pour chaque formation.",
    deadline: "2025-12-25",
    status: "pending",
    phase: "phase1"
  },
  {
    id: "1.5",
    title: "JPO Celsa - Samedi 10 janvier",
    description: "Journ\xE9e Portes Ouvertes Celsa : 10h-18h \xE0 Neuilly-sur-Seine (77 rue de Villiers). Pr\xE9sentiel + Distanciel.",
    deadline: "2026-01-10",
    status: "urgent",
    phase: "phase1",
    link: "https://www.celsa.fr/evenement/journee-portes-ouvertes-du-celsa/"
  },
  {
    id: "1.6",
    title: "JPO ISCOM - Samedi 17 janvier",
    description: "Journ\xE9es Portes Ouvertes ISCOM Lyon (10h-16h) et Bordeaux (10h-15h30).",
    deadline: "2026-01-17",
    status: "urgent",
    phase: "phase1",
    link: "https://www.iscom.fr/fr/iscom-lyon/informations-pratiques/prochains-rendez-vous-a-lyon"
  },
  {
    id: "1.7",
    title: "JPO Sup de Pub - Samedi 17-24 janvier",
    description: "Journ\xE9es Portes Ouvertes Sup de Pub \xE0 Paris et r\xE9gions. Consulter les dates pr\xE9cises sur le site.",
    deadline: "2026-01-24",
    status: "urgent",
    phase: "phase1",
    link: "https://www.supdepub.com"
  },
  {
    id: "1.8",
    title: "Participer aux salons d'orientation",
    description: "Assister aux salons d'orientation pour rencontrer des \xE9coles et des \xE9tudiants ambassadeurs.",
    deadline: "2026-01-31",
    status: "pending",
    phase: "phase1"
  },
  {
    id: "1.9",
    title: "Participer \xE0 la 2e semaine d'orientation",
    description: "Assister aux r\xE9unions d'orientation au lyc\xE9e (2e trimestre) pour affiner ton projet.",
    deadline: "2026-02-28",
    status: "pending",
    phase: "phase1"
  },
  {
    id: "1.10",
    title: "\xC9changer avec des professionnels",
    description: "Contacter des charg\xE9s de com ou chefs de projet \xE9v\xE9nementiel (LinkedIn, famille) pour discuter des m\xE9tiers.",
    deadline: "2026-01-31",
    status: "pending",
    phase: "phase1"
  },
  // PHASE 2: PARCOURSUP (Janvier - Mars 2026)
  {
    id: "2.1",
    title: "Ouvrir mon compte Parcoursup",
    description: "\xC0 partir du 19 janvier, cr\xE9er ton compte et remplir ton profil sur Parcoursup.",
    deadline: "2026-01-19",
    status: "urgent",
    phase: "phase2",
    link: "https://www.parcoursup.fr"
  },
  {
    id: "2.2",
    title: "T\xE9l\xE9charger les documents n\xE9cessaires",
    description: "Pr\xE9parer : photo d'identit\xE9, num\xE9ro INE, informations parents, adresse mail valide.",
    deadline: "2026-01-20",
    status: "pending",
    phase: "phase2"
  },
  {
    id: "2.3",
    title: "Identifier mes favoris sur Parcoursup",
    description: "Ajouter tes formations favorites pour les comparer et pr\xE9parer progressivement tes v\u0153ux.",
    deadline: "2026-01-25",
    status: "pending",
    phase: "phase2",
    link: "https://www.parcoursup.fr"
  },
  {
    id: "2.4",
    title: "R\xE9fl\xE9chir \xE0 mon ordre de pr\xE9f\xE9rence",
    description: "Classer tes \xE9coles : 1. Celsa, 2. ISCOM, 3. Sup de pub, 4. DN Made, 5. BUT Info-Com, 6. BTS Communication.",
    deadline: "2026-01-30",
    status: "pending",
    phase: "phase2"
  },
  {
    id: "2.5",
    title: "Formuler mes 10 v\u0153ux",
    description: "Ajouter tes 10 v\u0153ux principaux sur Parcoursup (sans obligation de les classer).",
    deadline: "2026-02-28",
    status: "pending",
    phase: "phase2",
    link: "https://www.parcoursup.fr"
  },
  {
    id: "2.6",
    title: "Ajouter des sous-v\u0153ux si disponibles",
    description: "Pour certaines formations, ajouter des sous-v\u0153ux pour augmenter tes chances.",
    deadline: "2026-03-05",
    status: "pending",
    phase: "phase2"
  },
  {
    id: "2.7",
    title: "Formuler des v\u0153ux en apprentissage (optionnel)",
    description: "Ajouter jusqu'\xE0 10 v\u0153ux suppl\xE9mentaires pour des formations en apprentissage si int\xE9ress\xE9e.",
    deadline: "2026-03-10",
    status: "pending",
    phase: "phase2"
  },
  {
    id: "2.8",
    title: "Valider mes v\u0153ux - DEADLINE 12 mars",
    description: "Dernier jour pour ajouter de nouveaux v\u0153ux. Apr\xE8s cette date, tu ne peux que modifier tes v\u0153ux existants.",
    deadline: "2026-03-12",
    status: "urgent",
    phase: "phase2",
    link: "https://www.parcoursup.fr"
  },
  // PHASE 3: DOSSIERS (Février - Avril 2026)
  {
    id: "3.1",
    title: "R\xE9diger ma lettre de motivation g\xE9n\xE9rale",
    description: "\xC9crire un brouillon : ta passion pour la com/l'\xE9v\xE9nementiel, tes qualit\xE9s, ton projet professionnel.",
    deadline: "2026-02-05",
    status: "pending",
    phase: "phase3"
  },
  {
    id: "3.2",
    title: "Personnaliser mes lettres par \xE9cole",
    description: "Adapter ta lettre pour chaque \xE9cole (Celsa, ISCOM, Sup de pub) : montrer ce qui te pla\xEEt dans chacune.",
    deadline: "2026-02-20",
    status: "pending",
    phase: "phase3"
  },
  {
    id: "3.3",
    title: "Cr\xE9er mon CV",
    description: "CV 1 page : tes exp\xE9riences, comp\xE9tences en communication, activit\xE9s qui te passionnent.",
    deadline: "2026-02-10",
    status: "pending",
    phase: "phase3"
  },
  {
    id: "3.4",
    title: "Pr\xE9parer mes documents",
    description: "Rassembler : notes, certificats de stage, recommandations, portfolio cr\xE9atif si tu en as un.",
    deadline: "2026-02-25",
    status: "pending",
    phase: "phase3"
  },
  {
    id: "3.5",
    title: "M'inscrire au concours ISCOM",
    description: "S'inscrire aux \xE9preuves d'admission ISCOM (plusieurs sessions disponibles d'octobre 2025 \xE0 ao\xFBt 2026).",
    deadline: "2026-02-28",
    status: "pending",
    phase: "phase3",
    link: "https://www.iscom.fr/fr/iscom/prochains-rendez-vous/\xE9preuve-d'admission-ecole-communication"
  },
  {
    id: "3.6",
    title: "Compl\xE9ter mon dossier Parcoursup",
    description: "Ajouter tous les documents demand\xE9s : lettres, CV, documents suppl\xE9mentaires pour chaque v\u0153u.",
    deadline: "2026-03-20",
    status: "pending",
    phase: "phase3",
    link: "https://www.parcoursup.fr"
  },
  {
    id: "3.7",
    title: "Confirmer mes v\u0153ux - DEADLINE 1er avril",
    description: "Dernier jour pour finaliser ton dossier et confirmer chacun de tes v\u0153ux.",
    deadline: "2026-04-01",
    status: "urgent",
    phase: "phase3",
    link: "https://www.parcoursup.fr"
  },
  // PHASE 4: SUIVI (Mars - Mai 2026)
  {
    id: "4.1",
    title: "\xC9changer avec mes professeurs",
    description: "Partager ton projet, demander leur soutien pour la Fiche Avenir avant le 1er mars.",
    deadline: "2026-03-01",
    status: "urgent",
    phase: "phase4"
  },
  {
    id: "4.2",
    title: "Consulter ma Fiche Avenir",
    description: "V\xE9rifier les avis et la coh\xE9rence sur Parcoursup apr\xE8s que les professeurs l'aient compl\xE9t\xE9e.",
    deadline: "2026-03-10",
    status: "pending",
    phase: "phase4"
  },
  {
    id: "4.3",
    title: "M'entra\xEEner pour les entretiens",
    description: "Faire des simulations, r\xE9fl\xE9chir aux questions classiques (pourquoi cette \xE9cole ? ton projet ? tes qualit\xE9s ?).",
    deadline: "2026-03-15",
    status: "pending",
    phase: "phase4"
  },
  {
    id: "4.4",
    title: "Pr\xE9parer les \xE9preuves des concours",
    description: "R\xE9viser pour les concours des \xE9coles (ISCOM, Celsa, Sup de pub) selon leurs calendriers.",
    deadline: "2026-04-30",
    status: "pending",
    phase: "phase4"
  },
  // PHASE 5: FINALISATION (Mai - Juin 2026)
  {
    id: "5.1",
    title: "Relire mes v\u0153ux",
    description: "Revoir l'ordre, v\xE9rifier les documents, corriger les petites erreurs avant la fin de la proc\xE9dure.",
    deadline: "2026-05-25",
    status: "pending",
    phase: "phase5"
  },
  {
    id: "5.2",
    title: "Pr\xE9parer ma r\xE9ponse aux propositions",
    description: "R\xE9fl\xE9chir \xE0 ta strat\xE9gie : quelles propositions accepter, refuser, mettre en attente.",
    deadline: "2026-05-30",
    status: "pending",
    phase: "phase5"
  },
  // PHASE 6: RÉSULTATS (Juin 2026)
  {
    id: "6.1",
    title: "D\xE9couvrir les r\xE9sultats - 2 juin",
    description: "Consulter les r\xE9ponses Parcoursup, voir les propositions (Oui/Oui-si), listes d'attente.",
    deadline: "2026-06-02",
    status: "urgent",
    phase: "phase6",
    link: "https://www.parcoursup.fr"
  },
  {
    id: "6.2",
    title: "R\xE9pondre aux propositions",
    description: "Accepter ou refuser les propositions dans les d\xE9lais (pense \xE0 r\xE9pondre pour chaque proposition).",
    deadline: "2026-06-10",
    status: "urgent",
    phase: "phase6"
  },
  {
    id: "6.3",
    title: "Organiser mes v\u0153ux en attente - 5-8 juin",
    description: "Classer par ordre de pr\xE9f\xE9rence tes v\u0153ux en attente (du 5 au 8 juin 2026).",
    deadline: "2026-06-08",
    status: "urgent",
    phase: "phase6",
    link: "https://www.parcoursup.fr"
  },
  {
    id: "6.4",
    title: "Phase compl\xE9mentaire (si n\xE9cessaire)",
    description: "Si besoin, formuler jusqu'au 10 nouveaux v\u0153ux pour formations ayant des places (du 11 juin au 10 septembre).",
    deadline: "2026-06-11",
    status: "pending",
    phase: "phase6",
    link: "https://www.parcoursup.fr"
  },
  {
    id: "6.5",
    title: "Me concentrer sur les \xE9preuves du bac",
    description: "Les d\xE9lais de r\xE9ponse sont suspendus du 12 au 19 juin pour te permettre de te concentrer sur le bac.",
    deadline: "2026-06-19",
    status: "pending",
    phase: "phase6"
  },
  // PHASE 7: INSCRIPTION (Juillet - Septembre 2026)
  {
    id: "7.1",
    title: "M'inscrire apr\xE8s les r\xE9sultats du bac",
    description: "Apr\xE8s les r\xE9sultats du bac (7 juillet), effectuer ton inscription administrative dans l'\xE9tablissement choisi.",
    deadline: "2026-07-07",
    status: "urgent",
    phase: "phase7"
  },
  {
    id: "7.2",
    title: "Finaliser mon inscription",
    description: "Compl\xE9ter les formalit\xE9s administratives, r\xE9gler les frais d'inscription, r\xE9cup\xE9rer tes codes d'acc\xE8s.",
    deadline: "2026-07-15",
    status: "pending",
    phase: "phase7"
  },
  {
    id: "7.3",
    title: "Chercher un logement \xE9tudiant",
    description: "Commencer les recherches de logement (Crous, agences, colocation). Demander les aides si \xE9ligible.",
    deadline: "2026-07-31",
    status: "pending",
    phase: "phase7"
  },
  {
    id: "7.4",
    title: "Demander les aides financi\xE8res",
    description: "Demander les bourses, logement Crous, aide \xE0 la mobilit\xE9 si tu y es \xE9ligible.",
    deadline: "2026-08-15",
    status: "pending",
    phase: "phase7"
  },
  {
    id: "7.5",
    title: "Pr\xE9parer la rentr\xE9e",
    description: "Organiser : fournitures, logement \xE9tudiant, documents administratifs, transport.",
    deadline: "2026-08-30",
    status: "pending",
    phase: "phase7"
  },
  {
    id: "7.6",
    title: "Participer aux journ\xE9es d'int\xE9gration",
    description: "Assister aux journ\xE9es d'int\xE9gration de l'\xE9cole pour rencontrer tes futurs camarades.",
    deadline: "2026-09-15",
    status: "pending",
    phase: "phase7"
  }
];

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/dev-server.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  actions: router({
    /**
     * Get all actions with user's progress
     */
    list: protectedProcedure.query(async ({ ctx }) => {
      const actionsData = initialActions.map((action) => ({
        id: action.id,
        title: action.title,
        description: action.description,
        deadline: action.deadline,
        phase: action.phase,
        link: action.link || null
      }));
      await seedActions(actionsData);
      const [allActions, userProgress2] = await Promise.all([
        getAllActions(),
        getUserProgress(ctx.user.id)
      ]);
      const progressMap = new Map(
        userProgress2.map((p) => [p.actionId, p.completed])
      );
      return allActions.map((action) => ({
        ...action,
        status: progressMap.get(action.id) ? "completed" : "pending"
      }));
    }),
    /**
     * Toggle action completion
     */
    toggle: protectedProcedure.input(z2.object({ actionId: z2.string() })).mutation(async ({ ctx, input }) => {
      const newStatus = await toggleActionCompletion(
        ctx.user.id,
        input.actionId
      );
      return {
        actionId: input.actionId,
        completed: newStatus
      };
    }),
    /**
     * Get progress statistics
     */
    stats: protectedProcedure.query(async ({ ctx }) => {
      return await getUserProgressStats(ctx.user.id);
    })
  })
});
export {
  appRouter
};
