import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  FlaskConical,
  Rocket,
  Search,
  Users,
} from "lucide-react";
import EnfoqueParticles from "./components/enfoque-particles";

const enfoque = [
  {
    icon: Search,
    titulo: "Entendemos",
    texto: "Partimos de un diagnóstico real de cada persona y proyecto para tomar decisiones basadas en evidencia.",
  },
  {
    icon: Users,
    titulo: "Co-creamos",
    texto: "Diseñamos junto a las participantes soluciones que integran miradas diversas y retos reales de la industria.",
  },
  {
    icon: FlaskConical,
    titulo: "Pilotamos",
    texto: "Experimentamos de forma controlada, aprendemos rápido y ajustamos antes de escalar cada iniciativa.",
  },
  {
    icon: Rocket,
    titulo: "Desplegamos",
    texto: "Llevamos lo validado a más participantes, amplificando el propósito y midiendo los resultados.",
  },
];

const valores = [
  {
    titulo: "Humildad",
    texto:
      "Reconocemos que el crecimiento nace de escuchar activamente a cada participante y de aprender junto a ellas en cada módulo.",
    destacado: false,
  },
  {
    titulo: "Colaboración",
    texto:
      "Creemos que los retos se resuelven mejor en comunidad: conectamos mentoras, formadoras y participantes para generar valor compartido.",
    destacado: true,
  },
  {
    titulo: "Valentía",
    texto:
      "Impulsamos decisiones audaces que desafían el status quo y acompañamos a cada mujer a convertir la incertidumbre en oportunidad.",
    destacado: false,
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-pista-bg-pastel px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <Rocket
          className="pointer-events-none absolute -right-16 -top-16 hidden text-pista-red/5 sm:block"
          size={420}
          strokeWidth={1}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-pista-charcoal shadow-sm">
            <Rocket size={16} className="text-pista-red" />
            Track Mujeres · Pista 8
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-pista-charcoal sm:text-6xl lg:text-7xl">
            Despegamos talento y proyectos valientes
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-pista-slate sm:text-xl">
            Track Mujeres es el programa de Pista 8 que impulsa el crecimiento
            profesional de mujeres a través de formación, mentoría y comunidad.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/consulta"
              className="flex items-center justify-center gap-2 rounded-lg bg-pista-red px-7 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-pista-red/90"
            >
              Consultar Asistencia
              <ArrowRight size={18} />
            </Link>
            <Link
              href="#enfoque"
              className="flex items-center justify-center rounded-lg border border-pista-slate/30 px-7 py-3.5 font-semibold text-pista-charcoal transition-all duration-200 hover:bg-white"
            >
              Conoce más
            </Link>
          </div>
        </div>
      </section>

      <section
        id="enfoque"
        className="relative flex min-h-[85vh] items-center overflow-hidden bg-pista-charcoal px-4 py-20 sm:px-6 lg:px-8"
      >
        <EnfoqueParticles />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 20%, rgba(254,66,0,0.18), transparent 40%), radial-gradient(circle at 85% 75%, rgba(254,66,0,0.12), transparent 35%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl">
          <h2 className="text-center text-4xl font-bold text-white sm:text-5xl">
            Nuestro <span className="text-pista-red">enfoque</span>
          </h2>
          <div className="relative mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-white/15 lg:block" />
            {enfoque.map(({ icon: Icon, titulo, texto }) => (
              <div key={titulo} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-pista-red bg-pista-charcoal">
                  <Icon className="text-pista-red" size={26} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">
                  {titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-pista-red sm:text-4xl">
              Valores
            </h2>
            <div className="mt-10 flex flex-col gap-6">
              {valores.map(({ titulo, texto, destacado }) => (
                <div
                  key={titulo}
                  className={`rounded-xl border-2 p-8 transition-all duration-200 ${
                    destacado
                      ? "border-pista-red"
                      : "border-pista-charcoal/80 hover:border-pista-slate/40"
                  }`}
                >
                  <h3 className="text-sm font-bold uppercase tracking-wide text-pista-charcoal">
                    {titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pista-slate">
                    {texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-72 overflow-hidden rounded-2xl sm:h-96 lg:h-full lg:min-h-[560px]">
            <Image
              src="/valores-pista8.webp"
              alt="Equipo de Pista 8 colaborando en un evento"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-pista-charcoal px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Respaldo institucional
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            <Image
              src="/Copia de PISTA-8-LOGO_FINAL-BLANCO (3).png"
              alt="Pista 8"
              width={320}
              height={180}
              className="h-20 w-auto sm:h-24"
            />
            <span className="text-2xl font-semibold tracking-wide text-white/80">
              UNIVALLE
            </span>
          </div>
          <p className="max-w-xl text-sm text-white/70">
            Track Mujeres certifica la participación de cada estudiante en
            alianza con Univalle, respaldando su formación con reconocimiento
            institucional.
          </p>
        </div>
      </section>
    </>
  );
}
