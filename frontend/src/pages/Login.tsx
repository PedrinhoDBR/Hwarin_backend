import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Input } from '../components/index';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/UseAuth';
import { login, registerUser } from '../services/api';

export default function Welcome() {
  const navigate = useNavigate();
  const { setAuthSession } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'cadastro'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();
    const normalizedName = fullName.trim();

    if (activeTab === 'cadastro' && !normalizedName) {
      setErrorMessage('Informe seu nome para criar a conta.');
      setErrorOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeTab === 'cadastro') {
        await registerUser({
          username: normalizedName,
          email: normalizedEmail,
          password,
        });
      }

      const result = await login(normalizedEmail, password);
      setAuthSession(result);
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Erro ao fazer login');
      }

      setErrorOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
        <div className="hidden lg:block" />

        <div className="relative flex min-h-screen items-center justify-center bg-black/20 px-6 py-8 backdrop-blur-lg sm:px-10 lg:px-16">
          <div className="absolute right-6 top-6 h-16 w-16 overflow-hidden rounded-full border border-white/15 bg-black/25 shadow-xl backdrop-blur-sm sm:right-10 sm:top-8 lg:right-12 lg:top-10 lg:h-20 lg:w-20">
            <img
              src="/LogoBlack.png"
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>

          <motion.div
            className="z-10 w-full max-w-md rounded-3xl border border-white/10 bg-black/30 p-8 shadow-2xl backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-8">
              <h1 className="font-cinzel text-3xl font-bold text-foreground mb-2">
                Bem-vindo
              </h1>
              <p className="text-muted-foreground text-sm">
                Entre no universo das histórias
              </p>
            </div>

            <div className="flex rounded-xl overflow-hidden mb-8 border border-border bg-secondary/50 p-1">
              <button
                type="button"
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeTab === 'cadastro'
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('cadastro')}
              >
                Cadastro
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {activeTab === 'cadastro' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <Input
                    placeholder="Nome completo..."
                    icon={<User className="h-4 w-4" />}
                    value={fullName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFullName(event.target.value)}
                    autoComplete="name"
                  />
                </motion.div>
              )}

              <Input
                type="email"
                placeholder="Email..."
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />

              <Input
                type="password"
                placeholder="Senha..."
                icon={<Lock className="h-4 w-4" />}
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                required
              />

              <Button
                className="w-full h-12 rounded-xl bg-linear-to-r from-primary to-accent text-primary-foreground font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? activeTab === 'login'
                    ? 'Entrando...'
                    : 'Criando conta...'
                  : activeTab === 'login'
                    ? 'Entrar'
                    : 'Criar Conta'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {activeTab === 'login' && (
              <p className="text-center mt-4 text-sm text-muted-foreground">
                Esqueceu a senha?{' '}
                <button type="button" className="text-accent hover:underline">Recuperar</button>
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <Alert
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
    </>
  );
}
