// Dentro do App.tsx, componente PaywallGlobal
const PaywallGlobal = () => {
  const { isPaywallOpen, setPaywallOpen } = useSettingsStore();

  useEffect(() => {
    const checkTrial = () => {
        // 1. Check if user is VIP (Forever)
        if (localStorage.getItem('cytyos_license_type') === 'VIP') return;

        // 2. Check if user has active trial
        const trialEnd = localStorage.getItem('cytyos_trial_end');
        if (trialEnd && Date.now() < Number(trialEnd)) {
            return; // Trial is still active, do nothing
        }
        
        // 3. If no VIP and no active trial, Open Paywall
        setPaywallOpen(true);
    };

    // Check after 60 seconds of usage
    const timer = setTimeout(checkTrial, 60000); 

    return () => clearTimeout(timer);
  }, [setPaywallOpen]);

  return (
    <Suspense fallback={null}>
      <PricingModal 
        isOpen={isPaywallOpen} 
        onClose={() => setPaywallOpen(false)} 
      />
    </Suspense>
  );
};