import React from 'react';
import { Copy, Check, FileCode, Download } from 'lucide-react';
import { laravelFiles } from '../laravelCode';
import { Card, PageHeader, Badge, Button } from '../components/UI';

const GROUPS = [
  { key: 'database/migrations', label: 'Migrations', icon: '🗄️' },
  { key: 'database/seeders', label: 'Seeders', icon: '🌱' },
  { key: 'app/Models', label: 'Models', icon: '📦' },
  { key: 'app/Http/Controllers', label: 'Controllers', icon: '🎮' },
  { key: 'app/Http/Middleware', label: 'Middleware', icon: '🛡️' },
  { key: 'app/Exports', label: 'Exports', icon: '📤' },
  { key: 'routes', label: 'Routes', icon: '🛣️' },
  { key: 'resources/views', label: 'Views (Blade)', icon: '🎨' },
  { key: 'composer', label: 'Dependencies', icon: '📋' },
];

export function SourceCodePage() {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const [activeGroup, setActiveGroup] = React.useState(GROUPS[0].key);

  const filesInGroup = laravelFiles
    .map((f, i) => ({ ...f, originalIdx: i }))
    .filter((f) => f.path.startsWith(activeGroup) || (activeGroup === 'composer' && f.path.startsWith('composer')));

  React.useEffect(() => {
    if (filesInGroup[0]) setActiveIdx(filesInGroup[0].originalIdx);
    // eslint-disable-next-line
  }, [activeGroup]);

  const file = laravelFiles[activeIdx];

  const copy = () => {
    navigator.clipboard.writeText(file.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadAll = () => {
    const all = laravelFiles.map((f) => `// ===== ${f.path} =====\n\n${f.code}\n\n`).join('\n');
    const blob = new Blob([all], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laravel-peminjaman-barang-source.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Source Code Laravel"
        subtitle="Kode lengkap project Laravel — copy-paste ke project Anda"
        actions={
          <>
            <Badge color="violet"><FileCode size={11} /> {laravelFiles.length} files</Badge>
            <Button onClick={downloadAll}><Download size={14} /> Download Semua</Button>
          </>
        }
      />

      <Card className="mb-4">
        <div className="text-sm text-white/70">
          <strong className="text-white">📘 Cara penggunaan:</strong> Buat project Laravel baru:{' '}
          <code className="text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded">composer create-project laravel/laravel peminjaman_barang</code>
          <br />Setup database <code className="text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded">.env</code> ke MySQL,
          lalu copy file-file di bawah ini ke struktur sesuai path-nya. Jalankan:
          <code className="text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded ml-1">php artisan migrate --seed</code>
        </div>
      </Card>

      {/* Group tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {GROUPS.map((g) => (
          <button
            key={g.key}
            onClick={() => setActiveGroup(g.key)}
            className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap transition ${
              activeGroup === g.key ? 'btn-primary text-white' : 'btn-ghost text-white/70'
            }`}
          >
            <span className="mr-1.5">{g.icon}</span> {g.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        {/* File list */}
        <Card className="!p-2 max-h-[600px] overflow-y-auto">
          {filesInGroup.map((f) => {
            const name = f.path.split('/').pop();
            return (
              <button
                key={f.originalIdx}
                onClick={() => setActiveIdx(f.originalIdx)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition flex items-center gap-2 ${
                  activeIdx === f.originalIdx ? 'bg-violet-500/15 text-violet-200 border border-violet-400/30' : 'hover:bg-white/5 text-white/70'
                }`}
              >
                <FileCode size={13} className="shrink-0" />
                <span className="truncate text-xs">{name}</span>
              </button>
            );
          })}
        </Card>

        {/* Code view */}
        <Card className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <div className="text-xs text-white/60 font-mono truncate">{file.path}</div>
            <div className="flex items-center gap-2">
              <Badge color="blue">{file.lang}</Badge>
              <button onClick={copy} className="btn-ghost px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                {copied ? <><Check size={12} /> Tersalin</> : <><Copy size={12} /> Salin</>}
              </button>
            </div>
          </div>
          <pre className="code-block !rounded-none !border-0 p-4 max-h-[560px] text-white/85"><code>{file.code}</code></pre>
        </Card>
      </div>
    </div>
  );
}
