// src/data/cplRules.js
import { CheckCircle, AlertTriangle, Trophy } from 'lucide-react';

export const CPL_RULES = [
  {
    id: 'format',
    title: '01. Match Format',
    color: 'text-amber-500',
    content: [
      { label: '8 Overs', sub: 'Per Inning' },
      { label: '3 Matches', sub: 'Per Team (League Stage)' }
    ]
  },
  {
    id: 'bowling',
    title: '02. Bowling & Fielding',
    color: 'text-amber-500',
    list: [
      'Minimum 5 bowlers must be used.',
      'Max 3 overs per bowler.',
      'Max 2 bouncers allowed per over.',
      'Powerplay (Overs 1-2): Only 1 fielder allowed outside the circle.',
      'No LBW (Leg Before Wicket).'
    ]
  },
  {
    id: 'penalties',
    title: '03. Scoring & Penalties',
    color: 'text-red-500',
    cards: [
      {
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        title: 'Late Arrival Penalty',
        titleColor: 'text-red-400',
        desc: 'Teams not reporting 15 mins before match time will face a 5 Run Penalty or play with 1 less fielder.'
      },
      {
        icon: Trophy,
        iconColor: 'text-amber-500',
        title: 'Boundary Rules',
        titleColor: 'text-white',
        desc: 'Ball going outside the offside fence = 2 Runs. Trees/Obstacles are 4/6 as per umpire.'
      }
    ]
  }
];