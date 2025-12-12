import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { ChristmasHero } from './ChristmasHero';
import { RamadanHero } from './RamadanHero';
import EasterHero from './EasterHero';
import NormalSeasonHero from './NormalSeasonHero';
import { HeroLoader } from '../Shared/HeroLoader';

const DynamicHero = () => {
  const [activeHero, setActiveHero] = useState('normal');
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveHero();
    
    // Set up real-time subscription for hero changes
    const subscription = supabase
      .channel('heroes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'heroes' }, 
        () => {
          fetchActiveHero();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchActiveHero = async () => {
    try {
      console.log('Fetching active hero...'); // Debug log
      
      const { data, error } = await supabase
        .from('heroes')
        .select(`
          *,
          hero_features (
            icon,
            text,
            display_order
          )
        `)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching active hero:', error);
        throw error;
      }

      if (data) {
        console.log('Found active hero:', data.name); // Debug log
        setActiveHero(data.name);
        setHeroData(data);
      } else {
        console.log('No active hero found, using normal hero');
        setActiveHero('normal');
        setHeroData(null);
      }
    } catch (error) {
      console.error('Error in fetchActiveHero:', error);
      // Fallback to normal hero if there's an error
      setActiveHero('normal');
      setHeroData(null);
    } finally {
      // Add a minimum loading time for smooth UX
      setTimeout(() => setLoading(false), 800);
    }
  };

  // Show loading state with beautiful animation
  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <HeroLoader />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Render the appropriate hero component with smooth transition
  return (
    <section id="home">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeHero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {(() => {
            switch (activeHero) {
              case 'christmas':
                return <ChristmasHero heroData={heroData} />;
              case 'ramadan':
                return <RamadanHero heroData={heroData} />;
              case 'easter':
                return <EasterHero heroData={heroData} />;
              case 'normal':
              default:
                return <NormalSeasonHero heroData={heroData} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default DynamicHero;