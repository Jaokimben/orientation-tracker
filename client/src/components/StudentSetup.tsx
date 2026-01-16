import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StudentSetupProps {
  onSetupComplete: (studentName: string) => void;
  initialName?: string;
}

export default function StudentSetup({ onSetupComplete, initialName = '' }: StudentSetupProps) {
  const [studentName, setStudentName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim()) {
      setError('Veuillez entrer ton nom');
      return;
    }

    if (studentName.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères');
      return;
    }

    // Sauvegarder en localStorage
    localStorage.setItem('studentName', studentName.trim());
    onSetupComplete(studentName.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black p-8 md:p-12 neo-shadow-lg transform -rotate-1 max-w-md w-full">
        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase leading-none mb-2">
            Bienvenue !
          </h1>
          <p className="font-mono text-lg font-bold bg-blue-400 text-white inline-block px-4 py-1 transform rotate-1">
            Orientation 2026
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="studentName" className="block font-bold text-lg mb-3 uppercase">
              Quel est ton nom ?
            </label>
            <Input
              id="studentName"
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                setError('');
              }}
              placeholder="Ex: Marie Dupont"
              className="border-3 border-black text-lg p-3 font-mono"
              autoFocus
            />
            {error && (
              <p className="text-red-600 font-bold mt-2 text-sm">{error}</p>
            )}
          </div>

          <div className="bg-yellow-100 border-2 border-black p-4 rounded">
            <p className="font-mono text-sm">
              💡 Ce nom sera utilisé dans ton parcours d'orientation personnalisé. Tu pourras le changer à tout moment.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white font-bold text-lg py-3 border-3 border-black hover:bg-gray-800 transform hover:scale-105 transition-transform uppercase"
          >
            Commencer mon parcours →
          </Button>
        </form>

        {/* Décoration */}
        <div className="mt-8 text-center text-4xl">
          🎓 📚 💼
        </div>
      </div>
    </div>
  );
}
