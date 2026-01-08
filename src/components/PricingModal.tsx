// Adicione o import
import { useAuth } from '../contexts/AuthContext';

// ... dentro do componente PricingModal ...
export const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  const { user } = useAuth(); // <--- Pegar usuário logado
  // ... (restante dos states) ...

  const handleValidateKey = async () => {
    setError('');
    setSuccessMsg('');
    if (!accessKey) return;
    
    setIsValidating(true);
    const code = accessKey.toUpperCase().trim();

    try {
        // 1. Chaves Offline (Mantém igual)
        // ... (código existente das offline keys) ...

        // 2. Chaves do Banco (ALTERADO)
        try {
            // AGORA PASSAMOS O EMAIL PARA RASTREIO
            const coupon = await couponService.validateAndTrack(code, user?.email || undefined);
            
            const trialEndsAt = Date.now() + (coupon.duration_minutes * 60 * 1000);
            localStorage.setItem('cytyos_trial_end', trialEndsAt.toString());
            
            setSuccessMsg(`Trial Ativado! Acesso liberado por ${coupon.duration_minutes} min.`); // Mostra minutos ou horas
            
            setTimeout(() => { 
                setPaywallOpen(false);
                onClose(); 
            }, 1500);
            
        } catch (dbError: any) {
            setError(dbError.message || 'Cupom Inválido');
        }

    } catch (err) {
        setError('Erro na validação');
    } finally {
        setIsValidating(false);
    }
  };