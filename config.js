// Aji Bio-Pharma Website UAT — configuration.
// This is the only file you normally edit. Commit it and GitHub Pages
// picks up the change on the next page load.
window.UAT_CONFIG = {

  // Paste the Web App URL from Apps Script (Deploy → New deployment → Web app).
  // Leave empty to run in demo mode: results stay in the current browser only.
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbxjXS9cTjXh5jUemAU7H8AYlle4VhcgnzprNPfS8tS3-20io9w_CPSH3rCO_ib6AVQHOA/exec',

  // Site under test. Page paths in pages.csv are appended to this.
  siteUrl: 'https://live.ajibio.com',

  // Last day of UAT (YYYY-MM-DD). Drives "Days remaining".
  deadline: '2026-10-01',

  testers: [
    'Aika Higuchi', 'Ayako Shibata', 'Daisuke Takahashi', 'Eri Akune',
    'Els Roeland', 'Hiroki Imai', 'Hiroki Inoue', 'Hiroyuki Nozaki',
    'Joris DeKeijser', 'Kousuke Nakajima', 'Kentaro Nakase', 'Masahito Kuroda',
    'Hannah Munizza', 'Kelsie Hegemeyer', 'Paul Madesen', 'Nobuhiro Yamanaka',
    'Tomohiro Fujii', 'Taisuke Ichimaru', 'Tomomi Kimura', 'Toru Okamatsu',
    'Daniel Casey', 'Marina Corleto', 'Yusuke Nakane', 'Yohei Yamada'
  ],

  // Optional: limit a tester to certain sections (names must match the
  // Section column in pages.csv). Anyone not listed tests every section.
  // Example:  'Els Roeland': ['Small Molecule', 'Company'],
  assignments: {
  },

  // Test columns, left to right. `group` sets the header band.
  checks: [
    { id: 'url',            label: 'URL Pattern',   group: 'General' },
    { id: 'm_layout',       label: 'Layout',        group: 'Mobile'  },
    { id: 'm_content',      label: 'Content',       group: 'Mobile'  },
    { id: 'm_assets',       label: 'Assets',        group: 'Mobile'  },
    { id: 'm_interactions', label: 'Interactions',  group: 'Mobile'  },
    { id: 'd_layout',       label: 'Layout',        group: 'Desktop' },
    { id: 'd_content',      label: 'Content',       group: 'Desktop' },
    { id: 'd_assets',       label: 'Assets',        group: 'Desktop' },
    { id: 'd_interactions', label: 'Interactions',  group: 'Desktop' },
    { id: 'forms',          label: 'Forms',         group: 'Site'    },
    { id: 'translations',   label: 'Translations',  group: 'Site'    }
  ],

  issueStatuses: ['Reported', 'In Review', 'Deferred', 'In Progress', 'Ready to Retest', 'Complete'],
  contentTypes:  ['Copy', 'Asset', 'Link', 'Translation', 'Other']
};
