'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Globe2, Sparkles, Users } from 'lucide-react';

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

function useAnimatedCounter(target: number, duration: number = 1800): number {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Smooth ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return count;
}

function StatCard({ stat }: { stat: StatItem }) {
  const animatedValue = useAnimatedCounter(stat.value, 1800);
  const Icon = stat.icon;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-300 text-center flex flex-col items-center justify-between group">
      {/* Icon */}
      <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center mb-1.5 sm:mb-2.5 shadow-2xs group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
      </div>

      {/* Animated Number */}
      <div className="my-0.5 sm:my-1">
        <span className={`text-xl sm:text-3xl md:text-4xl font-black tracking-tight ${stat.gradient}`}>
          {animatedValue.toLocaleString()}{stat.suffix}
        </span>
      </div>

      {/* Labels */}
      <div>
        <p className="text-xs sm:text-sm font-bold text-stone-800 leading-tight">
          {stat.label}
        </p>
        <p className="text-[10px] sm:text-xs text-stone-400 mt-0.5 hidden xs:block">
          {stat.sublabel}
        </p>
      </div>
    </div>
  );
}

export default function AnimatedStats() {
  const stats: StatItem[] = [
    {
      icon: Globe2,
      value: 22,
      suffix: '+',
      label: 'World Languages',
      sublabel: 'English, French, Danish, Norse & more',
      gradient: 'text-stone-900',
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600',
    },
    {
      icon: Sparkles,
      value: 17900,
      suffix: '+',
      label: 'Curated Pet Names',
      sublabel: 'Cute, Luxury, Funny & Noble styles',
      gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-amber-500',
      iconBg: 'bg-orange-50',
      iconColor: 'text-brand-500',
    },
    {
      icon: Users,
      value: 28500,
      suffix: '+',
      label: 'Happy Pet Parents',
      sublabel: 'Pets named worldwide',
      gradient: 'text-stone-900',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="mt-6 sm:mt-10 max-w-3xl mx-auto w-full">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>
    </div>
  );
}
