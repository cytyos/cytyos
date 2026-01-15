const handleCloseAttempt = () => {
      // CORREÇÃO CRÍTICA:
      // Se estou na Landing Page ('/'), eu devo poder fechar o modal livremente.
      if (location.pathname === '/') {
          setPaywallOpen(false);
          return;
      }
      
      // Se estou DENTRO do App ('/app'), verifico se devo bloquear
      const isVip = localStorage.getItem('cytyos_license_type') === 'VIP';
      const trialEnd = localStorage.getItem('cytyos_trial_end');
      const firstVisit = sessionStorage.getItem('cytyos_first_visit');
      const timeUsed = firstVisit ? Date.now() - Number(firstVisit) : 99999999;
      const stillInFreeTier = timeUsed < FREE_USAGE_MS;
      const aiLimitReached = localStorage.getItem('cytyos_limit_reached') === 'true';

      // Se o usuário ainda tem tempo grátis ou é VIP, libera o fechamento
      if (isVip || (trialEnd && Date.now() < Number(trialEnd)) || stillInFreeTier) {
          setPaywallOpen(false);
      } else {
          // Se acabou o tempo e tentou fechar, joga pra Home e fecha o modal
          navigate('/');
          setPaywallOpen(false);
      }
  };