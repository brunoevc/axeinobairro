const fs = require('fs');
const path = 'src/routeTree.gen.ts';
let text = fs.readFileSync(path, 'utf8');
const replacements = [
  [
    "const AdminIndexRoute = AdminIndexRouteImport.update({\r\n  id: '/admin/',\r\n  path: '/admin/',\r\n  getParentRoute: () => rootRouteImport,\r\n} as any)",
    "const AdminIndexRoute = AdminIndexRouteImport.update({\r\n  id: '/admin/',\r\n  path: '/admin/',\r\n  getParentRoute: () => Admin_rootRoute,\r\n} as any)"
  ],
  [
    "const AdminPlanosRoute = AdminPlanosRouteImport.update({\r\n  id: '/admin/planos',\r\n  path: '/admin/planos',\r\n  getParentRoute: () => rootRouteImport,\r\n} as any)",
    "const AdminPlanosRoute = AdminPlanosRouteImport.update({\r\n  id: '/admin/planos',\r\n  path: '/admin/planos',\r\n  getParentRoute: () => Admin_rootRoute,\r\n} as any)"
  ],
  [
    "const AdminLojasRoute = AdminLojasRouteImport.update({\r\n  id: '/admin/lojas',\r\n  path: '/admin/lojas',\r\n  getParentRoute: () => rootRouteImport,\r\n} as any)",
    "const AdminLojasRoute = AdminLojasRouteImport.update({\r\n  id: '/admin/lojas',\r\n  path: '/admin/lojas',\r\n  getParentRoute: () => Admin_rootRoute,\r\n} as any)"
  ],
  [
    "const AdminAprovacoesRoute = AdminAprovacoesRouteImport.update({\r\n  id: '/admin/aprovacoes',\r\n  path: '/admin/aprovacoes',\r\n  getParentRoute: () => rootRouteImport,\r\n} as any)",
    "const AdminAprovacoesRoute = AdminAprovacoesRouteImport.update({\r\n  id: '/admin/aprovacoes',\r\n  path: '/admin/aprovacoes',\r\n  getParentRoute: () => Admin_rootRoute,\r\n} as any)"
  ]
];
let changed = false;
for (const [oldStr, newStr] of replacements) {
  if (text.includes(oldStr)) {
    text = text.split(oldStr).join(newStr);
    changed = true;
  }
}
if (!changed) {
  console.error('No replacements made');
  process.exit(1);
}
fs.writeFileSync(path, text, 'utf8');
console.log('updated');
