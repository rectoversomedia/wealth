
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { WealthScore, OpportunityScore, AiReport } from '@/types';

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ className = 'h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L28 28H4L16 4Z" fill="currentColor" opacity="0.9" />
      <path d="M14 18H22V22H14V18Z" fill="currentColor" />
      <text x="34" y="23" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" fill="currentColor">WealthLeadEngine</text>
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = 'needs-attention' | 'review' | 'on-track';
type Urgency = 'high' | 'medium' | 'low';

function statusLabel(s: Status) {
  return { 'needs-attention': 'Needs Attention', 'review': 'Review Recommended', 'on-track': 'On Track' }[s];
}
function urgencyDot(u: Urgency) {
  return { high: 'bg-red-500', medium: 'bg-amber-400', low: 'bg-emerald-400' }[u];
}
function statusStyle(s: Status): string {
  return {
    'needs-attention': 'text-red-600 bg-red-50 border-red-200',
    'review': 'text-amber-600 bg-amber-50 border-amber-200',
    'on-track': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  }[s];
}
function leftBorder(s: Status): string {
  return {
    'needs-attention': 'border-l-red-400',
    'review': 'border-l-amber-400',
    'on-track': 'border-l-emerald-400',
  }[s];
}

// ─── Deep Recommendation Card ──────────────────────────────────────────────────
interface RecSection {
  title: string;
  content: string;
  type: 'explain' | 'context' | 'step' | 'flag' | 'comparison' | 'formula';
}

interface DeepRecCard {
  icon: string;
  category: string;
  status: Status;
  urgency: Urgency;
  headline: string;
  sections: RecSection[];
}

function DeepRecommendationCard({ card, index }: { card: DeepRecCard; index: number }) {
  const [expanded, setExpanded] = useState(index < 3);
  const delay = Math.min(index * 60, 300);
  const statusColor = statusStyle(card.status);
  const urgencyColor = urgencyDot(card.urgency);
  const urgencyLabel = { high: 'Segera Ditangani', medium: 'Perlu Ditinjau', low: 'Dalam Perbaikan' }[card.urgency];

  function sectionBadge(type: RecSection['type']) {
    const map = {
      'explain': { bg: 'bg-slate-100 text-slate-600', label: 'Mengapa Penting' },
      'context': { bg: 'bg-blue-50 text-blue-600', label: 'Konteks' },
      'step': { bg: 'bg-emerald-50 text-emerald-700', label: 'Langkah' },
      'flag': { bg: 'bg-red-50 text-red-600', label: 'Bendera Merah' },
      'comparison': { bg: 'bg-purple-50 text-purple-700', label: 'Perbandingan' },
      'formula': { bg: 'bg-amber-50 text-amber-700', label: 'Hitungan' },
    };
    return map[type];
  }

  return (
    <div
      className={`bg-white border border-slate-200 border-l-4 ${leftBorder(card.status)} rounded-2xl shadow-sm overflow-hidden transition-all animate-fade-in-up`}
      style={{ animationDelay: delay + 'ms' }}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
            {card.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.category}</span>
              <div className="flex items-center gap-2">
                <span className={'inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ' + statusColor}>
                  <span className={'w-1.5 h-1.5 rounded-full ' + urgencyColor} />
                  {statusLabel(card.status)}
                </span>
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-800">{card.headline}</h3>
          </div>
        </div>

        {/* Sections preview */}
        <div className="mt-4 space-y-2">
          {card.sections.slice(0, expanded ? undefined : 3).map(function(sec, i) {
            const badge = sectionBadge(sec.type);
            return (
              <div key={i} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ' + badge.bg}>{badge.label}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{sec.content}</p>
              </div>
            );
          })}
        </div>

        {/* Expand/Collapse */}
        {card.sections.length > 3 && (
          <button
            onClick={function() { setExpanded(!expanded); }}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp width={14} height={14} />
                Tampilkan Lebih Sedikit
              </>
            ) : (
              <>
                <ChevronDown width={14} height={14} />
                Lihat {card.sections.length - 3} Bagian Lainnya
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Tingkat urgensi:</span>{' '}
          <span className={'font-semibold ' + (card.urgency === 'high' ? 'text-red-600' : card.urgency === 'medium' ? 'text-amber-600' : 'text-emerald-600')}>{urgencyLabel}</span>
          {' '}— {card.urgency === 'high' ? 'Bahas dengan advisor dalam 30 hari' : card.urgency === 'medium' ? 'Tinjau dalam 3 bulan' : 'Lanjutkan evaluasi berkala'}
        </p>
      </div>
    </div>
  );
}

// ─── RoadmapCard ─────────────────────────────────────────────────────────────
function RoadmapCard({ priority, index }: { priority: { priority: number; topic: string; explanation: string }; index: number }) {
  const colors = ['bg-amber-400', 'bg-blue-400', 'bg-purple-400'];
  return (
    <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: (index * 100) + 'ms' }}>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${colors[index]} text-white font-bold text-sm flex items-center justify-center flex-shrink-0`}>
          {priority.priority}
        </div>
        {index < 2 && <div className="w-px flex-1 bg-slate-200 my-2 min-h-[40px]" />}
      </div>
      <div className="flex-1 pb-6">
        <h4 className="font-bold text-slate-800 mb-1">{priority.topic}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{priority.explanation}</p>
      </div>
    </div>
  );
}

// ─── EmailCaptureForm ─────────────────────────────────────────────────────────
function EmailCaptureForm({ sessionId, opportunityScore, topDimension, weakDimension, onSubmitted }: {
  sessionId: string; opportunityScore: number; topDimension: string; weakDimension: string; onSubmitted: () => void;
}) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', consent: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const setField = function(name: string, value: string | boolean) {
    setForm(function(prev) { return { ...prev, [name]: value } as typeof prev; });
  };

  const handleSubmit = async function(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email) { setError('Email is required'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sessionId, opportunityScore, topDimension, weakDimension }),
      });
      if (res.ok) { setSent(true); onSubmitted(); }
      else { setError('Something went wrong. Please try again.'); }
    } catch { setError('Connection error.'); }
    finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
        <p className="text-sm text-emerald-700 font-semibold">Report sent! Check your inbox.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="First name" value={form.firstName} onChange={function(ev) { setField('firstName', ev.currentTarget.value); }} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
        <input required placeholder="Last name" value={form.lastName} onChange={function(ev) { setField('lastName', ev.currentTarget.value); }} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
      </div>
      <input required type="email" placeholder="Email address" value={form.email} onChange={function(ev) { setField('email', ev.currentTarget.value); }} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
      <label className="flex items-start gap-2">
        <input type="checkbox" checked={form.consent} onChange={function() { setField('consent', !form.consent); }} className="mt-0.5" />
        <span className="text-xs text-slate-500">I agree to receive communications about financial planning. No spam - unsubscribe anytime.</span>
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button type="submit" disabled={loading || !form.consent} className="w-full py-2.5 bg-amber-400 text-slate-900 font-bold text-sm rounded-lg hover:bg-amber-300 disabled:opacity-50 transition-all">
        {loading ? 'Sending...' : 'Send My Report'}
      </button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
interface ResultsData {
  sessionId: string;
  wealthScore: WealthScore;
  opportunityScore: OpportunityScore;
  aiReport: AiReport;
  firstName?: string;
}

export default function ResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const router = useRouter();
  const [data, setData] = useState<ResultsData | null>(null);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(function() {
    const stored = sessionStorage.getItem('assessment_result');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.error) { router.replace('/assessment'); return; }
        setData(parsed);
      } catch { router.replace('/assessment'); }
    } else { router.replace('/assessment'); }
  }, [router]);

  useEffect(function() {
    if (data) {
      sessionStorage.setItem('assessment_result', JSON.stringify(data));
    }
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading your report...</p>
        </div>
      </div>
    );
  }

  const { wealthScore, opportunityScore, aiReport } = data;
  const rawName = data.firstName || aiReport?.executiveSummary?.split(' ')[1]?.replace(/,/g, '') || 'there';
  const allDims = wealthScore.dimensions;
  const topDim = allDims.slice().sort(function(a, b) { return b.percentage - a.percentage; })[0];
  const weakDim = allDims.slice().sort(function(a, b) { return a.percentage - b.percentage; })[0];

  // ── Build Deep Recommendations ──────────────────────────────────────────────
  var recs: DeepRecCard[] = [];

  // ── 1. RETIREMENT ───────────────────────────────────────────────────────────
  (function() {
    var ret = allDims.find(function(d) { return d.label === 'Retirement Readiness'; });
    if (!ret) return;
    var s: Status = ret.percentage < 60 ? 'needs-attention' : ret.percentage < 75 ? 'review' : 'on-track';
    var u: Urgency = ret.percentage < 60 ? 'high' : ret.percentage < 75 ? 'medium' : 'low';
    var sections: RecSection[] = [];

    sections.push({
      type: 'explain',
      title: 'Apa Itu Retirement Readiness?',
      content: 'Retirement readiness adalah sejauh mana sumber daya finansial Anda hari ini mampu mempertahankan standar hidup Anda setelah berhenti bekerja. Di Singapura, ini bukan hanya tentang punya tabungan — melainkan mengkoordinasikan CPF (AccountOA, SA, MA), SRS, investasi pribadi, dan properti menjadi satu sistem pendapatan yang sustainable. Tanpa koordinasi ini, Anda berisiko mengalami "longevity risk" — hidup lebih lama dari uang Anda.',
    });

    sections.push({
      type: 'formula',
      title: 'Cara Menghitung Target Corpus Pensiun',
      content: 'Rumus sederhana: (Pengeluaran tahunan saat pensiun x 25) = target corpus dasar. Contoh: kalau Anda butuh S$60.000/tahun, target minimum adalah S$1.500.000. Di Singapura, CPF Life di usia 65 memberikan sekitar S$2.000-S$2.500/bulan jika SA penuh — ini sudah mencakup sebagian besar kebutuhan dasar. Untuk gaya hidup lebih baik,缺口 (gap) perlu diisi dari investasi dan SRS.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 1: Cek Posisi CPF Anda Sekarang',
      content: 'Buka cpf.gov.sg dan cek: (1) Ordinary Account (OA) — untuk investasi dan properti, bunga 2.5%. (2) Special Account (SA) — untuk retirement dan kesehatan, bunga 4%. (3) Medisave — untuk rumah sakit dan insurance. Untuk FRS (Full Retirement Sum) 2024: S$205,800. BRS (Basic Retirement Sum): S$102,900. Jika SA+OA sudah melebihi FRS di usia 55, andaian Anda bisa mengunci dana tersebut untuk CPF Life.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 2: Proyeksikan CPF Life Payout',
      content: 'CPF Life memberitahu Anda payout bulanan seumur hidup — bukan lump sum. Di usia 65, setiap S$40.000 di SA menjadi sekitar S$330-S$400/bulan CPF Life (payout bervariasi). Gunakan CPF Life calculator dengan asumsi mulai payout di 65, 70, atau 75. Menunda payout sampai 70 bisa meningkatkan payout bulanan sampai 40% tanpa tambahan kontribusi.',
    });

    sections.push({
      type: 'flag',
      title: 'Bendera Merah: Tanda Anda Belum Siap',
      content: '- SA di bawah S$50.000 di usia 40+ — ada kemungkinan shortfall signifikan. /n- Mengandalkan hanya OA untuk retirement — bunga OA (2.5%) tidak cukup untuk mengalahkan inflasi medis jangka panjang. /n- Tidak punya voluntary contribution ke SA — Anda kehilangan "risk-free return" 4% plus penghematan pajak. /n- Belum锁定 (locked) FRS di 55 — OA yang tidak dialihkan bisa "terbakar" untuk pengeluaran konsumtif.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 3: SRS sebagai Complement',
      content: 'Supplementary Retirement Scheme (SRS) adalah rekening retirement kedua yang memberikan tax relief sekarang (marginal rate - 17-22% penghematan per S$1.000) dan payout di masa depan dengan biaya pajak rendah (S$400.000 akumulasi bebas pajak). Kontribusi SRS Ideal: S$15.300/tahun (maksimum untuk bukan warga negara) atau S$37.700 (WN). Dana SRS baru bisa ditarik penalty-free di usia 63 (setara dengan usia penarikan CPF Life).',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 4: Investasi di Luar CPF',
      content: 'CPF cover kebutuhan dasar — untuk gaya hidup pensiun yang lebih baik, investasi diperlukan. Portofolio yang tepat berdasarkan horizon: 20+ tahun: 80-90% equities (VWRA, SWRD, or equivalents). 10-20 tahun: 60-70% equities, 30% bonds. <10 tahun: 40-50% equities, 50% bonds/cash. Hindari endowment dan ILP untuk retirement — biaya 3-5%/tahun menggerus compound return secara signifikan.',
    });

    sections.push({
      type: 'comparison',
      title: 'CPF Life vs. Annuity Swasta vs. Self-Managed',
      content: 'CPF Life: dijamin pemerintah, inflation-adjusted, payout naik seiring usia. Annuity swasta (e.g., Singapore Annuity): payout lebih tinggi dari CPF Life, tapi premi mahal dan tidak ada death benefit. Self-managed portfolio: fleksibel, tapi exposed ke market volatility dan behavioral risk. Rekomendasi: gunakan CPF Life sebagai "floor income" (dasar terjamin), lalu SRS + investasi untuk top-up sampai gaya hidup pensiun target tercapai.',
    });

    sections.push({
      type: 'flag',
      title: 'Kesalahan Umum yang Membuat Retirement Gagal',
      content: '(1) "CPF saya cukup" — padahal hanya memenuhi BRS, bukan gaya hidup yang diinginkan. (2) Terlalu konservatif di usia 30-40 — money sitting di OA/fixed deposit kehilangan pertumbuhan. (3) Beli properti sebagai "forced savings" — tapi jika sudah punya satu properti, properti kedua sebagai investasi cenderung tidak outperform equities jangka panjang di Singapura. (4) Mengabaikan longevity risk — di usia 65, esperança hidup adalah 84 (pria) dan 87 (wanita). Pensiun bisa berlangsung 20-25 tahun.',
    });

    recs.push({
      icon: String.fromCodePoint(0x1F3D6),
      category: 'Retirement',
      status: s,
      urgency: u,
      headline: ret.percentage < 60 ? 'Retirement Fund: Fondasi yang Belum Cukup' : ret.percentage < 75 ? 'Retirement Plan Sudah Membentuk, Tapi Perlu Dioptimalkan' : 'Retirement Foundation Kuat, Lanjutkan Evaluasi',
      sections: sections,
    });
  })();

  // ── 2. ASSET ALLOCATION ─────────────────────────────────────────────────────
  (function() {
    var asset = allDims.find(function(d) { return d.label === 'Wealth Structure'; });
    if (!asset) return;
    var s: Status = asset.percentage < 65 ? 'needs-attention' : asset.percentage < 78 ? 'review' : 'on-track';
    var u: Urgency = asset.percentage < 65 ? 'high' : 'medium';
    var sections: RecSection[] = [];

    sections.push({
      type: 'explain',
      title: 'Mengapa Asset Allocation Menentukan Hasil Finansial Anda',
      content: 'Studies oleh Brinson, Hood & Beebower (1986, di-update 1991) menunjukkan bahwa lebih dari 90% variabilitas return portofolio dijelaskan oleh asset allocation — bukan stock picking atau market timing. Ini berarti cara Anda mendistribusikan uang di berbagai kelas aset (saham, obligasi, properti, cash) lebih penting daripada memilih saham mana yang harus dibeli. Distribution yang salah di usia 40 bisa berarti perbedaan S$500.000 di usia 60.',
    });

    sections.push({
      type: 'formula',
      title: 'Regel 100 Minus Umur (Starting Point)',
      content: 'Untuk investor yang belum punya strategi spesifik: (100 - umur) = persentase yang bisa diinvestasikan di equities. Contoh: usia 35, (100 - 35) = 65% di saham, 35% di obligasi/cash. Untuk usia 55+: 45% saham, 55% konservatif. Tapi ini hanya starting point — jika Anda seorang expat dengan income tinggi dan tidak bergantung pada lokal market, alokasi bisa lebih agresif. Risk tolerance SEHARUSNYA diukur dari perilaku, bukan sekadar questionnaire.',
    });

    sections.push({
      type: 'flag',
      title: 'Bendera Merah:分配 Salah',
      content: '- Lebih dari 50% di satu saham atau sektor — idiosyncratic risk tidak terdiversifikasi. /n- 100% di cash atau fixed deposit di bawah 50 tahun — inflasi menggerus purchasing power 2-3%/tahun. /n- Terlalu banyak real estate (lebih dari 50% total net worth) — real estate illiquid dan cost-intensive (mortgage, property tax, maintenance). /n- Tidak punya FX diversification — jika semua aset dalam satu mata uang dan mata uang itu melemah, purchasing power turun drastis.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 1: Petakan Semua Aset Anda Sekarang',
      content: 'Buat satu spreadsheet dengan kolom: Aset | Kategori | Nilai Sekarang | Negara Mata Uang | Liquidity | Expected Return | Risk Level. Kategori: (1) Cash & equivalents: savings, fixed deposits, money market. (2) Equities: individual stocks, ETFs, REITs, equity funds. (3) Fixed income: bonds, endowment (waspada biaya!). (4) Alternatives: gold, private equity (jika applicable). (5) Property: net equity (market value minus mortgage). (6) CPF & SRS. Total semua, lalu hitung persentase per kategori.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 2: Tentukan Risk Profile yang Jujur',
      content: 'Questionnaire risk profiling sering menipu — orang memilih "aggressive" karena mau return tinggi tapi tidak nyaman melihat portfolio turun 30%. Test risiko yang lebih jujur: (1) Bayangkan portfolio turun 40% besok — apa yang Anda lakukan? Jual? Hold? Beli lebih? (2) Berapa lama Anda bisa bertahan tanpa liquidity dari portfolio ini? (3) Apa goal yang gagal jika portfolio tidak recover selama 5 tahun? Jawaban "jual" dan "tidak bisa lebih dari 2 tahun" = risk profile Anda sebenarnya adalah moderate, bukan aggressive.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 3: Rebalancing — Kapan dan Bagaimana',
      content: 'Rebalancing adalah proses mengembalikan portofolio ke alokasi target. Dua pendekatan: (1) Calendar rebalancing: setiap 6 atau 12 bulan, jual aset yang outperform dan beli yang underperform. (2) Threshold rebalancing: jika satu kelas aset menyimpang lebih dari 5% dari target, rebalance. Pendekatan threshold lebih efficient karena merespons market movements yang sebenarnya. Contoh: target 70% equities. equities naik jadi 78% → jual 8% dan alihkan ke bonds.',
    });

    sections.push({
      type: 'comparison',
      title: 'Aktif vs. Pasif Investing untuk Asset Allocation',
      content: 'Passive (ETFs/Index funds seperti VWRA, SWRD, CSPX): biaya 0.1-0.3%/tahun, tax-efficient, outperform 80% active managers jangka panjang. Active: biaya 1-2%/tahun (fund manager + platform + transaction costs), membutuhkan ability dan willingness untuk选股 dan timing. Untuk 95% investor: passive + global diversification adalah pilihan yang lebih rasional. Untuk investor dengan kebutuhan spesifik (income generation, specific sectors, tax harvesting), active bisa relevan.',
    });

    sections.push({
      type: 'flag',
      title: 'Biaya Tersembunyi yang Menggerus Return',
      content: 'Setiap 1% biaya tambahan per tahun = 20% weniger wealth setelah 30 tahun (pada S$10.000/month compounding). Check: (1) Fund management fee — berapa %? endowment policies bisa 2-3%/tahun. (2) Platform fee — 0.1-0.5% per tahun di Interactive Brokers vs. 0.5-1% di bank. (3) Transaction costs — frequent trading + bid-ask spread. (4) Currency conversion fees — kalau kirim money pulang ke Indonesia, conversion cost bisa 1-2%. Aggregated, biaya-biaya ini bisa mengurangi effective return 2-4% per tahun.',
    });

    recs.push({
      icon: String.fromCodePoint(0x1F4CA),
      category: 'Asset Allocation',
      status: s,
      urgency: u,
      headline: asset.percentage < 65 ? 'Portfolio Belum Terdiversifikasi dengan Baik' : 'Asset Allocation Sudah Ada, Apakah Sudah Optimal?',
      sections: sections,
    });
  })();

  // ── 3. FAMILY PROTECTION ───────────────────────────────────────────────────
  (function() {
    var prot = allDims.find(function(d) { return d.label === 'Family Protection'; });
    if (!prot) return;
    var s: Status = prot.percentage < 65 ? 'needs-attention' : prot.percentage < 78 ? 'review' : 'on-track';
    var u: Urgency = prot.percentage < 65 ? 'high' : 'medium';
    var sections: RecSection[] = [];

    sections.push({
      type: 'explain',
      title: 'Apa Itu "Protection" dalam Konteks Financial Planning?',
      content: 'Protection planning menjawab satu pertanyaan: "Apa yang terjadi pada keluarga saya secara finansial jika saya sakit kritis, cacat, atau meninggal dunia?" Di Singapore, ada 5 jenis risiko yang perlu di-cover: (1) Death — pendapatan hilang, hutang tetap ada. (2) Critical Illness — biaya pengobatan + hilangnya income. (3) Disability — ketidakmampuan menghasilkan income jangka panjang. (4) Medical — biaya rumah sakit yang tidak ditanggung CPF MediShield/Integrated Shield Plans. (5) Income interruption — job loss atau bisnis revenue drop.',
    });

    sections.push({
      type: 'formula',
      title: 'Human Life Value (HLV) — Berapa Protection yang Cukup?',
      content: 'Formula dasar: (Pendapatan tahunan bersih x jumlah tahun sampai retirement) - (hutang bersih + biaya pendidikan anak + emergency fund). Contoh: S$150.000/tahun x 25 tahun = S$3.750.000. Minus: mortgage S$500.000 + pendidikan 2 anak S$200.000 = S$700.000. HLV = S$3.050.000. Ini adalah jumlah protection minimum yang diperlukan agar keluarga tidak mengalami financial shortfall jika pencari nafkah utama tidak ada. Life insurance TIDAK boleh melebihi HLV — lebih dari itu adalah "speculation" bukan protection.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 1: Audit Aset Protection yang Sudah Ada',
      content: 'Sebelum beli insurance baru, ketahui apa yang sudah ada: (1) CPF Life — memberitahu lump sum S$2.700-S$7.000 di usia 55+, tergantung kontribusi. (2) Employer group term life — biasanya 1-2x salary, kehilangan kalau resign/fired. (3) Employee benefits: disability coverage, medical. (4) Savings dan investments yang bisa dikonversi ke liquidity dalam 6 bulan. Jumlahkan semua protection existing, bandingkan dengan HLV yang baru dihitung. Selisihnya adalah缺口 (coverage gap) yang perlu diisi.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 2: Critical Illness Coverage yang Realistis',
      content: 'Critical illness (CI) di Singapore didefinisikan oleh LIA (Life Insurance Association) — 37 kondisi standar. Claim dilakukan sekaligus (lump sum), bukan reimbursement. Pertimbangan: (1) Early stage CI (e.g., early cancer) — payout 20-50% dari sum insured, berguna untuk treatment cost dan income buffer. (2) Intermediate — payout 50-75%. (3) Major — payout 100%. Rekomendasi: coverage minimum 3-5x annual income untuk major CI. Tapi jangan über-versichert — CI policies dengan coverage sangat besar punya premium yang mahal dan lebih baik dialihkan ke investment.',
    });

    sections.push({
      type: 'flag',
      title: 'Bendera Merah: Protection Planning',
      content: '- Punya mortgage tapi TIDAK punya decreasing term life — bank bisa mengambil properti jika debitor meninggal dan mortgage tidak lunas. /n- CI policy dari 20 tahun lalu dengan sum insured S$100.000 — di 2024, S$100.000 tidak cukup untuk biaya pengobatan modern. Sum insured harus reviewed secara periodik (setiap 3-5 tahun). /n- Punya Term insurance tapi tidak ada CI — 1 dari 4 orang di Singapura akan diagnosa CI sebelum 65. /n- Belum ada Lasting Power of Attorney (LPA) — jika Anda jadi incapacitated, tidak ada yang bisa akses rekening Anda untuk keluarga.',
    });

    sections.push({
      type: 'comparison',
      title: 'Term Life vs. Whole Life vs. Investment-Linked Plans (ILP)',
      content: 'Term Life: protection murni, cheapest per S$1.000 coverage, tidak ada cash value. Ideal untuk: couverture sementara (sampai mortgage lunas, sampai anak lulus). Contoh: S$1 juta coverage, 20 tahun, premium S$500-800/tahun. Whole Life: protection + savings, lebih mahal, cocok untuk estate planning dan legacy. Tapi return nya biasanya di bawah market performance. ILP: protection + investment, paling mahal karena biaya distribusi tinggi (initial charges 3-5%), manajer investasi fee 1-2%/tahun. Untuk 90% keluarga: term life + invest selisihpremi adalah pilihan superior.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 3: Disability Income Protection — Yang Paling Sering Terlupakan',
      content: 'Kemungkinan cacat (disability) sebelum age 65 di Singapore: sekitar 25% — lebih tinggi dari kematian. Jika Anda tidak bisa bekerja selama 2 tahun karena sakit atau kecelakaan, apakah savings cukup? Singapore Disability Insurance (SDI): tersedia melalui employer atau individu. Long-Term Disability (LTD): menggantikan 60-70% dari income jika tidak bisa bekerja. Untuk freelancer dan self-employed: ini adalah blind spot kritis. Consider SDI pribadi + contingency fund 6-12 bulan expenses.',
    });

    sections.push({
      type: 'explain',
      title: 'Beneficiary Designations — Detail yang Sering Diabaikan',
      content: 'CPF nominations: jika tidak dibuat, CPF savings masuk ke "unclaimed estates" dan bisa memakan waktu 6-12 bulan + biaya legal untuk keluarga. Buat nomination secara online di cpf.gov.sg — gratis dan bisa diupdate kapan saja. Insurance nominations: bajo LPA, nomination harus dibuat di polis. Jika belum ada LPA dan nomination belum dibuat, payouts bisa stuck di estate. Will + LPA + CPF nomination + Insurance nomination: empatnya harus aligned — otherwise ada celah yang bisa merugikan keluarga.',
    });

    recs.push({
      icon: String.fromCodePoint(0x1F6E1),
      category: 'Family Protection',
      status: s,
      urgency: u,
      headline: prot.percentage < 65 ? 'Protection Coverage Belum Memadai untuk Skenario Terburuk' : 'Protection Sudah Ada — Apakah Coverage Amount Masih Relevan?',
      sections: sections,
    });
  })();

  // ── 4. ESTATE PLANNING ─────────────────────────────────────────────────────
  (function() {
    var est = allDims.find(function(d) { return d.label === 'Estate Planning'; });
    if (!est) return;
    var s: Status = est.percentage < 65 ? 'needs-attention' : est.percentage < 78 ? 'review' : 'on-track';
    var u: Urgency = est.percentage < 65 ? 'high' : 'medium';
    var sections: RecSection[] = [];

    sections.push({
      type: 'explain',
      title: 'Estate Planning Bukan Hanya untuk Orang Kaya',
      content: 'Estate planning adalah proses memastikan bahwa setelah Anda meninggal, wealth Anda sampai ke orang yang Anda maksudkan, dengan cara yang Anda inginkan, secepat mungkin, dan biaya sesedikit mungkin. Tanpa estate planning, Singapore intestacy laws (Intestate Succession Act) menentukan siapa yang dapat warisan — mungkin bukan siapa yang Anda mau. Aset di Singapore: akan diproses melalui probate (kurleb 6-12 bulan). Tanpa will, proses ini jauh lebih sulit, mahal, dan contentious.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 1: Buat Lasting Power of Attorney (LPA) Sekarang',
      content: 'LPA adalah dokumen legal yang memberi authority ke orang yang Anda percaya ("donee") untuk membuat keputusan atas nama Anda jika Anda kehilangan mental capacity — karena kecelakaan, stroke, atau kondisi medis lainnya. Ada 2 jenis LPA: (1) LPA for Property & Financial Matters — untuk mengelola rekening bank, investasi, properti. (2) LPA for Healthcare & Personal Matters — untuk keputusan medis dan perawatan. Tanpa LPA, keluarga harus apply ke Court for a Deputy Order — biaya S$2.000-S$5.000 dan waktu 6-12 bulan. OAP file sekarang di lpa.gov.sg, biayanya S$75-S$200.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 2: Buat atau Update Will Anda',
      content: 'Will di Singapore harus memenuhi criteria: (1) Tertulis dan ditandatangani di hadapan 2 saksi yang bukan beneficiary. (2) Testator berusia 21 tahun ke atas dan cukup jasmani dan rohani. (3) Disimpan dengan aman. Keuntungan will yang dibuat dengan baik: (1) Anda control siapa dapat apa. (2) Bisa appoint guardian untuk anak-anak di bawah 21. (3) Bisa buat trust untuk beneficiary yang belum dewasa atau tidak mampu mengelola uang. (4) Probate process lebih cepat. Biaya: DIY akan wills dari S$200-S$500. Lawyer-prepared wills dari S$500-S$2.000 tapi lebih robust untuk situasi kompleks.',
    });

    sections.push({
      type: 'flag',
      title: 'Bendera Merah: Kondisi Estate yang Berbahaya',
      content: '- Punya aset di lebih dari 1 negara tapi hanya punya 1 will — will di satu negara tidak automatically cover aset di negara lain. Perlu will terpisah atau international will. /n- Joint bank accounts dan joint property ownership: ketika satu joint owner meninggal, aset langsung berpindah ke joint owner yang lain — ini tidak bisa dikontrol oleh will. Verify semua joint accounts apakah ini memang niat Anda. /n- Belum ada CPF nomination: CPF savings akan dialokasikan berdasarkan Intestate Succession Act, bukan keinginan Anda. /n- Beneficiary = minor (di bawah 21): tanpa trust clause di will, anak di bawah umur tidak bisa akses warisan sampai umur 21.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 3: Audit Semua Nominations dan Beneficiaries',
      content: 'Nominations adalah instruction legal yang mengalihkan aset langsung ke nominee — bypassing will. Ini adalah aset-aset yang WAJIB di-review: (1) CPF — nomination di cpf.gov.sg. (2) Insurance policies — nomination di polis (varies: trust nomination vs. non-trust). (3) Synced bank accounts — joint ownership vs. nominee arrangement. (4) Robo-advisor & brokerage accounts — beneficiary designation. (5) Singapore Savings Bonds — RSD nomination. Masalah umum: nominations di accounts lama expired atau tidak diupdate setelah divorce/marriage/new children.',
    });

    sections.push({
      type: 'explain',
      title: 'Singapore Estate Duty dan Tax Considerations',
      content: 'Singapore ABOLISHED estate duty pada 2008 untuk semua decedents. Ini berarti: tidak ada estate tax di Singapore untuk kematian yang terjadi setelah 2008. GOOD NEWS. Tapi: (1) Jika Anda warga negara Indonesia dengan aset di Indonesia, Indonesia MEMPUNYAI PPh terhadap warisan (PP 35/2023) dengan tarif hingga 30%. (2) Untuk US citizens di Singapore: US仍然在全球范围内对遗产征税，即使是非居民。 (3) Jika Anda punya trust di jurisdiksi dengan estate tax (UK: up to 40% untuk estates di atas GBP 325.000), trust structure butuh review specialist.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 4: Consider Trust Jika Situasi Lebih Kompleks',
      content: 'Trust adalah arrangement legal di mana trustee mengelola aset untuk benefit beneficiary. Relevant untuk: (1) Anak di bawah 21 — trust di dalam will memastikan dana dikelola sampai siap. (2) Beneficiary dengan managing money issues — trust mencegah mereka langsung mendapat akses ke jumlah besar. (3) Estate freeze — jika bisnis merupakan bagian besar dari estate, trust bisa facilitan perpindahan ownership tanpa harus dijual. Offshore trusts di Singapore (VCC, family trust) bisa relevant untuk ekspatriat dengan kondisi kompleks. Tapi trust creation dan maintenance cost S$5.000-S$50.000+ — perlu cost-benefit analysis.',
    });

    sections.push({
      type: 'comparison',
      title: 'Testate (Dengan Will) vs. Intestate (Tanpa Will) Process',
      content: 'Tanpa will (intestate): (1) District judge appoints administrator (biasanya keluarga terdekat). (2) Administrator harus apply ke Court untuk "Letter of Administration" — bukti authority. (3) Semua aset "frozen" sampai proses selesai. (4) Assets dialokasikan berdasarkan formula legal — mungkin bukan siapa yang Anda mau. (5) Biaya proses: S$2.000-S$10.000+ tergantung kompleksitas. Dengan will yang valid: (1) Executor (yang Anda appoint) mengambil alih proses. (2) Straightforward — bisa selesai dalam 6-8 bulan untuk simple estates. (3) Anda control distribusi. (4) Biaya proses jauh lebih rendah.',
    });

    recs.push({
      icon: String.fromCodePoint(0x1F4CB),
      category: 'Estate Planning',
      status: s,
      urgency: u,
      headline: est.percentage < 65 ? 'Estate Planning Belum Dimulai atau Mengandung Celah Kritis' : 'Estate Plan Sudah Ada — Apakah Masih Update dengan Kondisi Terkini?',
      sections: sections,
    });
  })();

  // ── 5. EDUCATION PLANNING ────────────────────────────────────────────────────
  (function() {
    var hasDeps = (aiReport?.executiveSummary || '').toLowerCase();
    var hasChildren = hasDeps.includes('depend') || hasDeps.includes('children') || hasDeps.includes('anak') || hasDeps.includes('family');
    if (!hasChildren && (opportunityScore.score > 50 && opportunityScore.score < 80)) {
      var sections: RecSection[] = [];

      sections.push({
        type: 'explain',
        title: 'Mengapa Education Planning Harus Dimulai Lebih Awal dari Yang Anda Kira',
        content: 'Biaya pendidikan universitas di Singapore dan luar negeri naik rata-rata 4-6% per tahun — hampir 2x lipat inflasi umum. Biaya S$30.000/tahun di 2024 akan menjadi S$40.000+/tahun dalam 8 tahun. Anak yang lahir hari ini akan masuk university sekitar 2042-2044. Di Singapore, NUS dan NTU undergraduate fees sekitar S$30.000-S$40.000 untuk 3-4 tahun. Overseas (UK, Australia, US): S$80.000-S$300.000+. Singapore Citizens bisa menggunakan payouts dari Children Development Account (CDA) yang di-matching oleh pemerintah (S$3 untuk setiap S$1, maks S$7.000/tahun dari pemerintah).',
      });

      sections.push({
        type: 'formula',
        title: 'Hitung: Berapa Sebenarnya Biaya Pendidikan Anak Anda?',
        content: 'Matrix biaya berdasarkan destinasi dan tipe: (1) Local university (NUS/NTU/SMU): S$35.000-S$55.000 untuk degree penuh — menggunakan CPF Education bisa cover sebagian. (2) Polytechnic: S$25.000-S$40.000 untuk 3 tahun diploma. (3) Overseas UK (Russell Group): S$180.000-S$280.000 untuk 3 tahun termasuk living cost. (4) Overseas US (Public university): S$200.000-S$350.000 untuk 4 tahun. (5) Medical/Law school overseas: S$400.000+. Inflation adjusted dalam 15 tahun: kalikan angka di atas dengan 1.8x sampai 2.2x.',
      });

      sections.push({
        type: 'step',
        title: 'Langkah 1: Cek Children Development Account (CDA) Anda',
        content: 'Jika anak Anda adalah warga negara Singapore: (1) Buka CDA di pos办公室 atau bank mana saja (DBS, OCBC, UOB, Maybank). (2) Dana di CDA di-match oleh pemerintah: hingga S$7.000 pertama/yearly contributions digandakan (maks S$21.000/year pemerintah contribution untuk anak pertama). (3) CDA funds bisa digunakan untuk pendidikan-related expenses di pos办公室 partner merchants. (4) Matched savings ini adalah "risk-free return" 100% dari pemerintah — tidak ada investasi lain yang memberikan return sebesar ini. Jika Anda belum punya CDA dan anak masih di bawah 12 tahun, buka SEGERA.',
      });

      sections.push({
        type: 'step',
        title: 'Langkah 2: Pilih Vehicle Investasi yang Tepat Berdasarkan Horizon',
        content: 'Time horizon adalah faktor paling penting dalam memilih vehicle: (1) Lebih dari 15 tahun: equities (global ETF, VWRA) — high growth, high volatility tapi time smoothes risk. (2) 10-15 tahun: 60-70% equities, 30-40% bonds — mulai kurangi risk. (3) 5-10 tahun: 40-50% equities, 50-60% bonds/cash — capital preservation mulai priority. (4) Kurang dari 5 tahun: tidak untuk equities — gunakan Singapore Savings Bonds (SSB), fixed deposits, atau endowments dengan maturity sesuai enrollment date. SSB: flexible, S$1.000 minimum, yield competitive dan fully liquidable tanpa penalty setelah 1 year.',
      });

      sections.push({
        type: 'flag',
        title: 'Bendera Merah: Education Planning Mistakes',
        content: '- Menggunakan whole life insurance untuk education fund — biaya tinggi, illiquid, return rendah dibanding ETFs. Lebih baik: term insurance untuk protection + separate investment untuk education fund. /n- Menunda mulai karena "masih ada waktu" — setiap tahun yang hilang mengurangi compound growth. S$500/month mulai usia 5 vs. mulai usia 10 = diferença S$200.000+ di age 18 (pada 8% annual return). /n- Mixing education fund dengan retirement fund — prioritas bertentangan. Jangan pernah trade off retirement untuk education fund. /n- Tidak ada contingency: jika orang tua sakit kritis, pendidikan juga terganggu. Prioritas: protection plan duluan sebelum education planning.',
      });

      sections.push({
        type: 'comparison',
        title: 'SSB vs. Endowments vs. ETFs untuk Education Fund',
        content: 'Singapore Savings Bonds (SSB): government-backed, fully guaranteed (no principal loss), flexible redemption, yield 2-3%+, ideal untuk 5-10 tahun horizon. Endowments: commitment 3-5 tahun, guaranteed or non-guaranteed maturity value, biaya 1-3%/year, return typically 2-4% — tidak outperform SSB net of fees untuk banyak kasus. Unit trusts/ETFs: highest growth potential, volatile, biaya rendah (0.1-0.3% untuk ETFs), ideal untuk 10+ tahun horizon. Kesimpulan: SSB untuk short-medium term; ETFs untuk long term. Endowment tidak competitive kecuali ada specific guaranteed maturity value yang dibutuhkan untuk budgeting certainty.',
      });

      recs.push({
        icon: String.fromCodePoint(0x1F393),
        category: 'Education Planning',
        status: 'review',
        urgency: 'medium',
        headline: 'Education Fund untuk Anak: Sudah Cukup Waktu dan Dihitung dengan Tepat?',
        sections: sections,
      });
    }
  })();

  // ── 6. TAX EFFICIENCY ───────────────────────────────────────────────────────
  (function() {
    var crossHigh = wealthScore.crossBorderComplexity === 'High' || wealthScore.crossBorderComplexity === 'Very High';
    var s: Status = crossHigh ? 'needs-attention' : 'review';
    var u: Urgency = crossHigh ? 'high' : 'medium';
    var sections: RecSection[] = [];

    sections.push({
      type: 'explain',
      title: 'Mengapa Tax Efficiency Bukan "Tax Evasion" — Tapi Legal Optimization',
      content: 'Tax efficiency adalah legal arrangement yang mengurangi jumlah pajak yang Anda bayar — bukan menghindari pajak secara illegal. Di Singapore: (1) Individual income tax: 0-22% marginal rate. (2) No capital gains tax — keuntungan dari investasi tidak dikenakan pajak. (3) No inheritance tax atau estate duty (sejak 2008). (4) No GST pada exports. Fitur-fitur ini membuat Singapore sangat attractive untuk wealth building. Tapi jika Anda punya income dari multiple jurisdictions atau memiliki perusahaan, tax efficiency strategy menjadi sangat relevant.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 1: Pahami Status Tax Residency Anda dengan Tepat',
      content: 'Di Singapore, Anda dianggap tax resident jika: (1) Fisik hadir di Singapore minimal 183 hari dalam calendar year, ATAU (2) Anda adalah Singapore citizen atau PR yang biasanya bekerja dan tinggal di Singapore. Tax resident status penting: (1) Progressive tax rates (0-22%) vs. non-resident flat rate 15-22%. (2) Qualify untuk Personal Income Tax Reliefs (S$1.000-S$80.000+ dalam reliefs). (3) spouse/child relief jika applicable. (4) Bisa berkontribusi ke SRS dengan tax relief. Check IMDA dan IRB (jika Malaysia related) untuk setiap negara yang Anda punya ties — jika Anda expat dengan tinggal diSG + income dari ID, Anda mungkin dianggap tax resident di kedua negara.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 2: Maksimalkan SRS untuk Tax Savings',
      content: 'Supplementary Retirement Scheme (SRS): (1) Contribute ke SRS → dapat tax deduction di tahun contribution. (2) Marginal tax rate 22%? Setiap S$1.000 contributed = S$220 tax saved. Contribute S$15.300 = tax saved S$3.366. (3) Dana grows tax-free sampai withdrawal. (4) Di age 63+, withdraw hanya 50% dari SRS fund — taxed at half your average tax rate. Strategi: jika Anda di marginal rate tinggi (17-22%), maximize SRS contributions sekarang. Jika Anda di rate rendah (2-7%), SRS contribution менее urgent karena tax savings kecil. SRS contribution sampai 63 bukan "forced savings" — Anda bisa withdraw sebagian saja.',
    });

    sections.push({
      type: 'flag',
      title: 'Bendera Merah: Tax Issues untuk Cross-Border Individuals',
      content: '- Bekerja remotely dari SG untuk employer ID/UK/US tanpa klarifikasi tax status — kedua negara bisa klaim pajak. /n- Memiliki PT PMA atau bisnis di Indonesia sebagai Singapore tax resident — keuntungan bisnis bisa dianggap taxable di SG jika remote management dari SG. /n- Tidak filing taxes di SG padahal ada SG-sourced income — 15-22% flat rate applies + penalties. /n- Membeli properti di SG dengan partner yang bukan spouse — gift tax dan ABSD implications. /n- CPF contributions di atas FRS — tidak ada tax relief tambahan. Contributions OA di atas S$37.740/year (FYR) kehilangan interest rate premium.',
    });

    if (crossHigh) {
      sections.push({
        type: 'step',
        title: 'Langkah 3: Double Taxation Agreements (DTA) — Weapon untuk Optimize',
        content: 'Singapore memiliki DTA dengan 90+ negara termasuk Indonesia (P3B ID-SG), UK, US, Australia, dll. DTA mencegah Anda dipajaki dua kali untuk income yang sama. Contoh: interest income dari Indonesia sebagai SG tax resident — Indonesia memajaki 20% (final tax), SG memberikan credit untuk pajak yang dibayar di ID terhadap SG tax pada income tersebut. Ini mencegah "double taxation." Tapi banyak DTA provisions yang nuanced — foreign tax credit (FTC) hanya claimable jika pajak sudah benar-benar dibayar di partner country. Review DTA applicability dengan tax advisor yang familiar dengan Indonesia-Singapore treaty adalah investasi yang worth it.',
      });

      sections.push({
        type: 'explain',
        title: 'Indonesia-Singapore Cross-Border Tax Considerations',
        content: 'Jika Anda warga negara Indonesia yang tinggal dan bekerja di Singapore sebagai tax resident SG: (1) SG-sourced income: taxed di SG (resident rate 0-22%). (2) Indonesia-sourced income (dividen, interest, royalty dari PT Indonesia): bisa taxed di ID (PPh 20-25% depending) tapi mendapat credit di SG berdasarkan DTA. (3) Remittance of funds dari SG ke ID: tidak ada SG withholding tax. Tapi perlu konsultasi apakah perlu dilaporkan di Indonesia sebagai overseas income (tergantung rezim pajak Indonesia: Worldwide income vs. territorial). CRITICAL: jika Anda masih WNI dan belum permanent residence di SG, tax obligations di Indonesia mungkin still apply — consult tax advisor dengan expertise ID-SG.',
      });
    }

    sections.push({
      type: 'comparison',
      title: 'Personal Holdings vs. Corporate Structure untuk Investasi',
      content: 'Jika portofolio investasi di atas S$500.000-S$1.000.000+, ada pertanyaan apakah sebaiknya hold via personal name atau via company (holding company). (1) Personal holdings: capital gains tidak taxed di SG, dividends tidak taxed di SG, inheritance straightforward. (2) Corporate holdings: potential 17% corporate income tax on investment gains, mais perlu valuation untuk estate purposes, lebih complex untuk inheritance. Untuk 95% investor dengan portfolio di bawah S$2.000.000: personal holding lebih efficient di Singapore karena no capital gains tax. Corporate structure mulai relevant jika: Anda punya bisnis dengan profits yang diinvestasikan, atau Anda planning untuk sell business dan rollover proceeds.',
    });

    recs.push({
      icon: String.fromCodePoint(0x1F3DE),
      category: 'Tax Efficiency',
      status: s,
      urgency: u,
      headline: crossHigh ? 'Cross-Border Tax Complexity: Sinergi SG-ID-UK/US Memerlukan Specialist' : 'Tax Efficiency: Ada Ruang Penghematan yang Mungkin Belum Dimanfaatkan',
      sections: sections,
    });
  })();

  // ── 7. INVESTMENT GROWTH ────────────────────────────────────────────────────
  (function() {
    var inv = allDims.find(function(d) { return d.label === 'Investment Growth'; });
    if (!inv) return;
    var s: Status = inv.percentage < 60 ? 'needs-attention' : inv.percentage < 75 ? 'review' : 'on-track';
    var u: Urgency = inv.percentage < 60 ? 'high' : 'medium';
    var sections: RecSection[] = [];

    sections.push({
      type: 'explain',
      title: 'Investment Growth Bukan Tentang Mengalahkan Market — Tapi Tentang Tidak Dikalahkan oleh Tujuan',
      content: 'Banyak investor fokus pada beating the market — ini adalah goal yang secara statistically gagal dicapai oleh 80% investors dan 90% active fund managers dalam jangka panjang. Goals-based investing berbeda: tentukan dulu: (1) Berapa banyak yang Anda butuhkan? (2) Kapan Anda butuh dana itu? (3) Berapa risk yang Anda tolerable dan mampu? THEN: pilih portfolio yang memaksimalkan kemungkinan mencapai goal tersebut, bukan yang maximize return. Ini mengubah paradigma: dari "return apa yang bisa saya dapat?" → "portfolio apa yang memberi saya 80% kemungkinan mencapai tujuan saya?".',
    });

    sections.push({
      type: 'formula',
      title: 'Impact Biaya pada Compounding: The Silent Return Killer',
      content: 'Contoh konkret: Investor A: 1% total fees/year, return gross 7%/tahun → net 6%. Investor B: 2.5% total fees (bank-managed endowment), return gross 8% → net 5.5%.Pada S$500/month, 30 tahun, 6% net vs. 5.5% net: Investor A: S$566.000. Investor B: S$472.000. Perbedaan S$94.000 — dari biaya tambahan 1.5%/tahun. annual fee difference. Ini adalah THE single biggest controllable variable dalam investment returns. Auditor: cek semua biaya: platform fee + fund management fee + transaction costs + currency conversion fees. Setiap 0.5% reduction = significant impact pada kekayaan bersih jangka panjang.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 1: Audit Portofolio — Apa yang Anda Hold dan Mengapa',
      content: 'Setiap aset dalam portofolio harus bisa dijawab pertanyaan: "Mengapa saya hold ini?" dan "Kapan saya akan jual ini?" Buat daftar untuk setiap posisi: (1) Nama aset dan kelas. (2) Alasan beli (growth? Income? Speculation? Inheritance?). (3) Target holding period. (4) Exit criteria — kapan akan jual. (5) Bagaimana jika turun 30% tomorrow? Jika Anda tidak bisa jawab pertanyaan-pertanyaan ini dengan jelas, aset tersebut mungkin tidak belong in your portfolio. Emotional investing — membeli karena "tips", FOMO, atau karena "sudah turun banyak" — adalah primary cause dari wealth destruction.',
    });

    sections.push({
      type: 'flag',
      title: 'Bendera Merah: Investment Practices yang Merugikan',
      content: '- Market timing: mencoba masuk dan keluar berdasarkan prediction — secara konsisten gagal. Data: investors who missed top 10 days in 20 years = returns cut by 50%. /n- Home bias: lebih dari 30% portofolio di SG-listed stocks — tidak perlu tambahan exposure ke ekonomi SG jika Anda tinggal dan berpenghasilan di SG. /n- Overtrading: setiap transaksi = biaya + taxes (0.2% GST on brokerage di SG). Trading aktif biasanya correlates dengan worse net returns. /n- Chasing dividends: yield-hunting tanpa peduli fundamental — dividen dari saham yang turun 40% bukan "income" itu capital loss. /n- Tidak rebalancing: portofolio yang tidak rebalanced drift ke riskier allocation seiring waktu.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 2: Building Your Core Portfolio (Evidence-Based)',
      content: '95% investor: one-fund portfolio adalah optimal. Pilihan: (1) VWRA (Vanguard FTSE All-World UCITS): 4.400+ companies di 47 negara, expense ratio 0.22%/year, accumulation ETF reinvests dividends automatically. (2) SWRD (iShares Core MSCI World): similar tapi accumulating juga. (3) IWDA + EIMI (if you want to manage currency exposure separately). Untuk income-generating variant: VT (Vanguard Total World Stock ETF) at 4% yield. Tidak mau rebalancing?Broker-advisors (StashAway, Syfe, Endowus) menawarkan diversified portfolios secara otomatis. Tapi fee 0.3-0.65%/year — masih acceptable tapi compare dengan self-managed VWRA at 0.22%.',
    });

    sections.push({
      type: 'explain',
      title: 'Behavioral Finance: Kenapa Majority of Retail Investors Selalu Kalah',
      content: 'Dalbar (2022) study: Average equity fund investor earned 1.6% less per year daripada fund itu sendiri — karena investors masuk saat market tinggi dan keluar saat market rendah. Cognitive biases yang paling merugikan: (1) Loss aversion — losing S$100 terasa 2x lebih painful dari winning S$100. Menyebabkan hold losses terlalu lama dan jual winners terlalu cepat. (2) Recency bias — "yang naik baru-baru ini" terasa lebih probable dari yang sebenarnya. Menyebabkan chasing recent outperformers. (3) Overconfidence — 80% drivers认为自己 above-average. Solutions: (1) Automate investments (standing instruction) sehingga tidak perlu decision setiap bulan. (2) Policy portfolio dengan written rules: "Saya akan rebalance jika equities deviate 5% dari target." Written rules = mengurangi emotional interference.',
    });

    sections.push({
      type: 'step',
      title: 'Langkah 3: Tax-Loss Harvesting — Strategi yang Legal dan Powerful',
      content: 'Di Singapore tidak ada capital gains tax — ini adalah KEUNTUNGAN BESAR yang banyak investor tidak utilize penuh. Tax-loss harvesting: jika Anda punya posisi yang LOSS, Anda bisa SELL untuk realize the loss (no tax in SG = pure benefit) dan immediately REBUY serupa aset untuk maintain market exposure. Proses ini: (1) Tidak mengurangi market exposure. (2) Mengunci unrealized loss menjadi realized loss (useful di tahun di mana Anda punya other capital gains). (3) Resets your cost basis ke harga lebih rendah = taxable gain lebih kecil ketika eventually sold at profit. Contoh: beli VWRA di S$100, turun ke S$85. Sell di S$85 (loss realized: N/A tax di SG), rebuy di S$85. Nanti VWRA naik ke S$120: taxable gain di-hitung dari S$85 bukan S$100. Net gain lebih kecil karena biaya acquisition lebih rendah.',
    });

    sections.push({
      type: 'comparison',
      title: 'Brokerage Platforms: Mana yang Best untuk Investor Jangka Panjang',
      content: 'Singapore retail investors punya akses ke: (1) Interactive Brokers (IBKR): platform paling cheapest untuk internasional investing, S$0 dividend withholding tax reclaim untuk US stocks (normal US withhold 30% untuk non-US persons, IB bisa reclaim sebagian), fee 0.05% per trade, minimum S$8. Best for: investors dengan portofolio S$50.000+. (2) Syfe/Endowus/StashAway: digital wealth platforms dengan automated portfolios. Fee 0.4-0.65%/year. Best for: investors yang mau automated rebalancing dan tidak mau manage sendiri. (3) Bank custody (DBS, OCBC, UOB): fee 0.2-0.5% per trade + custody fee 0.05-0.1%/year. Not recommended untuk long-term investors karena biaya aggregated tinggi. (4) DIY via CDP + broker: most control tapi higher costs dan inconvenient.',
    });

    recs.push({
      icon: String.fromCodePoint(0x1F4C8),
      category: 'Investment Growth',
      status: s,
      urgency: u,
      headline: inv.percentage < 60 ? 'Investment Portfolio: Belum Terbangun atau Perlu Restrukturisasi' : 'Portfolio Sudah Ada: Apakah Fees, Diversifikasi, dan Strategy Sudah Optimal?',
      sections: sections,
    });
  })();

  var priorities = aiReport?.topPriorities || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-sm text-slate-700">Wealth Lead Engine</span>
          </div>
          <Link href="/assessment" className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors">
            Retake &rarr;
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* Hero Summary */}
        <section className="mb-10 animate-fade-in-up">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Wealth Readiness Report
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
              Here&apos;s what we found,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">{rawName}</span>
            </h1>
            {aiReport?.executiveSummary && (
              <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
                {aiReport.executiveSummary}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Overall Readiness', value: String(wealthScore.overallScore) + '/100', sub: wealthScore.overallLabel, color: 'text-slate-800' },
              { label: 'Top Strength', value: (topDim?.label || '-').split(' ').slice(0, 2).join(' '), sub: String(topDim?.percentage || 0) + '%', color: 'text-emerald-600' },
              { label: 'Needs Focus', value: (weakDim?.label || '-').split(' ').slice(0, 2).join(' '), sub: String(weakDim?.percentage || 0) + '%', color: 'text-red-500' },
            ].map(function(stat) {
              return (
                <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <p className={'font-extrabold text-lg ' + stat.color}>{stat.value}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{stat.sub}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recommendations */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <CheckCircle width={16} height={16} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Personalized Recommendations</h2>
              <p className="text-sm text-slate-500">{recs.length} areas analyzed in depth</p>
            </div>
          </div>
          <div className="space-y-4">
            {recs.map(function(card, i) {
              return <DeepRecommendationCard key={card.category} card={card} index={i} />;
            })}
          </div>
        </section>

        {/* Roadmap */}
        {priorities.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your Action Roadmap</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              {priorities.map(function(p, i) {
                return <RoadmapCard key={p.priority} priority={p} index={i} />;
              })}
            </div>
          </section>
        )}

        {/* PEAK CTA */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-400 opacity-[0.07] blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-blue-500 opacity-[0.07] blur-3xl" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-400/30">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                You&apos;ve seen where you stand.
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-2 text-base leading-relaxed">
                Ini bukan akhir dari proses — ini adalah awal dari pemahaman yang lebih dalam. Detail di atas sudah sangat komprehensif, tapi implementasi nyata membutuhkan seseorang yang tahu persis situasi Anda dan bisa menyelaraskan setiap keputusan dengan kondisi Anda.
              </p>
              <p className="text-slate-500 max-w-lg mx-auto mb-8 text-sm">
                Tidak ada obligation. Tidak ada hard sell. Percakapan 30 menit yang focused.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/assessment/booking"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-amber-400 text-slate-900 font-extrabold text-sm rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
                >
                  <Calendar width={16} height={16} />
                  Book Free 30-Min Strategy Session
                </Link>
                <button
                  onClick={function() { setShowEmail(!showEmail); }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  <Mail width={16} height={16} />
                  Send My Full Report
                </button>
              </div>
              <div className="flex items-center justify-center gap-5 mt-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Lock width={12} height={12} />
                  Free
                </span>
                <span>&middot;</span>
                <span>No Obligation</span>
                <span>&middot;</span>
                <span>Confidential</span>
              </div>
            </div>
          </div>
        </section>

        {/* Email Form */}
        {showEmail && (
          <section className="mb-12 animate-scale-in">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Send yourself a copy</h3>
              <p className="text-sm text-slate-500 mb-6">Full report delivered immediately. We never share your details.</p>
              <EmailCaptureForm
                sessionId={data.sessionId}
                opportunityScore={opportunityScore.score}
                topDimension={topDim?.label || 'financial position'}
                weakDimension={weakDim?.label || 'financial planning'}
                onSubmitted={function() { setTimeout(function() { setShowEmail(false); }, 2000); }}
              />
            </div>
          </section>
        )}

        {/* Questions */}
        {aiReport?.suggestedQuestions && aiReport.suggestedQuestions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-500">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Questions Worth Asking an Advisor
            </h2>
            <div className="space-y-3">
              {aiReport.suggestedQuestions.map(function(q, i) {
                return (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-700">{q}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Cross-Border Alert */}
        {(wealthScore.crossBorderComplexity === 'High' || wealthScore.crossBorderComplexity === 'Very High') && (
          <section className="mb-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle width={18} height={18} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Cross-Border Complexity: {wealthScore.crossBorderComplexity}</h3>
                  <p className="text-sm text-red-600 leading-relaxed mb-3">
                    Situation Anda melibatkan multiple jurisdictions. Di sinilah kompleksitas nyata muncul — dan mengapa specialist advice bukan luxury, tapi necessity.
                  </p>
                  <Link href="/assessment/booking" className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700 hover:text-red-800 transition-colors">
                    Speak to a cross-border specialist &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong>Disclaimer:</strong> Konten ini bersifat edukasi dan informatif. Bukan saran finansial, investasi, legal, atau pajak. Konsultasikan dengan professional berlisensi sebelum mengambil keputusan finansial.
          </p>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 z-40 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-700">{priorities[0]?.topic || 'Analysis complete'}</p>
            <p className="text-xs text-slate-400">Personalized for your situation</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={function() { setShowEmail(!showEmail); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all"
            >
              Email Report
            </button>
            <Link href="/assessment/booking" className="inline-flex items-center gap-2 px-5 py-2 bg-amber-400 text-slate-900 text-xs font-extrabold rounded-lg hover:bg-amber-300 transition-all shadow-sm">
              Book Free Session
              <ArrowRight width={12} height={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
