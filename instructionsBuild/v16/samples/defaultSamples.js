export const sampleStructure = {
  "tagName": "div",
  "attributes": {
    "class": "max-w-2xl mx-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"
  },
  "children": [
    {
      "tagName": "div",
      "instruction": "bindHeader",
      "attributes": {
        "class": "border-b border-slate-200 dark:border-slate-800 pb-4"
      },
      "children": [
        {
          "tagName": "h1",
          "attributes": {
            "class": "text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
          },
          "textContent": "Loading..."
        },
        {
          "tagName": "p",
          "attributes": {
            "class": "text-sm text-slate-500 dark:text-slate-400 mt-1"
          },
          "textContent": ""
        }
      ]
    },
    {
      "tagName": "div",
      "instruction": "renderMemberList",
      "attributes": {
        "class": "space-y-3"
      }
    }
  ]
};

export const sampleInstructions = {
  "bindHeader": {
    "type": "bind",
    "bindings": {
      "children.0.textContent": "title",
      "children.1.textContent": "Showing ${totalCount} team members (Updated ${lastUpdated})"
    }
  },
  "renderMemberList": {
    "type": "loop",
    "dataPath": "members",
    "itemTemplate": {
      "tagName": "div",
      "attributes": {
        "class": "flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
      },
      "children": [
        {
          "tagName": "div",
          "attributes": {
            "class": "flex items-center gap-3"
          },
          "children": [
            {
              "tagName": "img",
              "attributes": {
                "class": "w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700"
              },
              "bindings": {
                "attributes.src": "avatar",
                "attributes.alt": "name"
              }
            },
            {
              "tagName": "div",
              "attributes": {
                "class": "flex flex-col"
              },
              "children": [
                {
                  "tagName": "span",
                  "attributes": {
                    "class": "font-semibold text-slate-800 dark:text-slate-100 text-sm"
                  },
                  "bindings": {
                    "textContent": "name"
                  }
                },
                {
                  "tagName": "span",
                  "attributes": {
                    "class": "text-xs text-slate-500 dark:text-slate-400"
                  },
                  "bindings": {
                    "textContent": "${role} • ${email}"
                  }
                }
              ]
            }
          ]
        },
        {
          "tagName": "span",
          "attributes": {
            "class": "px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
          },
          "bindings": {
            "textContent": "status",
            "attributes.data-status": "status"
          }
        }
      ]
    }
  }
};

export const sampleData = {
  "title": "Team Directory",
  "totalCount": 3,
  "lastUpdated": "2026-09-12",
  "members": [
    {
      "id": "USR-001",
      "name": "Alex Morgan",
      "role": "Lead Architect",
      "email": "alex@example.com",
      "status": "Active",
      "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Alex"
    },
    {
      "id": "USR-002",
      "name": "Sarah Connor",
      "role": "Security Engineer",
      "email": "sarah@example.com",
      "status": "Active",
      "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Sarah"
    },
    {
      "id": "USR-003",
      "name": "David Bowman",
      "role": "Data Specialist",
      "email": "david@example.com",
      "status": "On Leave",
      "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=David"
    }
  ]
};
