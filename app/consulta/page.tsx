"use client";

import { useState } from "react";
import {
  Award,
  AlertCircle,
  CheckCircle,
  ClipboardCheck,
  Loader2,
  MessageCircle,
  Rocket,
  Search,
  XCircle,
} from "lucide-react";

const pasos = [
  {
    icon: Search,
    titulo: "1. Ingresa tu C.I.",
    texto: "Escribe tu número de carnet de identidad en el buscador de arriba.",
  },
  {
    icon: ClipboardCheck,
    titulo: "2. Verificamos tu registro",
    texto: "Consultamos tu asistencia a los 15 módulos del programa en tiempo real.",
  },
  {
    icon: Award,
    titulo: "3. Revisa tu certificación",
    texto: "Verás tu porcentaje de asistencia y tu estado de certificación Univalle.",
  },
];

const WHATSAPP_SOPORTE_URL = `https://wa.me/59177593988?text=${encodeURIComponent(
  "Hola, quiero consultar sobre mi registro de asistencia en Track Mujeres."
)}`;

interface IAsistencia {
  ci: number;
  modulos: {
    numero: number;
    nombre: string;
    asistio: boolean;
  }[];
  porcentaje_asistencia: number;
  estado_certificacion: "Aprobado" | "Reprobado";
}

type Status = "idle" | "loading" | "success" | "error";

function AnilloProgreso({ porcentaje }: { porcentaje: number }) {
  const radio = 52;
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia - (porcentaje / 100) * circunferencia;

  return (
    <svg width={128} height={128} viewBox="0 0 120 120" className="-rotate-90">
      <circle
        cx="60"
        cy="60"
        r={radio}
        fill="none"
        stroke="#F2F3EE"
        strokeWidth="10"
      />
      <circle
        cx="60"
        cy="60"
        r={radio}
        fill="none"
        stroke="#FE4200"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circunferencia}
        strokeDashoffset={offset}
        className="transition-all duration-500 ease-out"
      />
    </svg>
  );
}

export default function ConsultaPage() {
  const [ciInput, setCiInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<IAsistencia | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const consultarAsistencia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ci = ciInput.trim();
    if (!ci) {
      setStatus("error");
      setErrorMessage("C.I. inválido");
      setData(null);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/asistencia/${ci}`);
      const body = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(body.error ?? "Ocurrió un error al consultar el registro.");
        setData(null);
        return;
      }

      setData(body as IAsistencia);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("No se pudo conectar con el servidor. Intenta nuevamente.");
      setData(null);
    }
  };

  const esAprobado = data?.estado_certificacion === "Aprobado";

  return (
    <div className="relative flex-1 overflow-hidden bg-pista-bg-pastel">
      <Rocket
        className="pointer-events-none absolute -right-20 -top-20 hidden text-pista-red/5 sm:block"
        size={380}
        strokeWidth={1}
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up mb-10 text-center">
          <h1 className="text-3xl font-bold text-pista-charcoal sm:text-4xl">
            Consulta de Asistencia
          </h1>
          <p className="mt-2 text-pista-slate">
            Ingresa tu número de C.I. para revisar tu registro en Track Mujeres.
          </p>
        </div>

        <form
          onSubmit={consultarAsistencia}
          className="animate-fade-in-up mx-auto mb-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "100ms" }}
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pista-slate"
              size={20}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={ciInput}
              onChange={(e) => setCiInput(e.target.value.replace(/\D/g, ""))}
              placeholder="Número de C.I."
              className="w-full rounded-lg border border-pista-slate/20 bg-white py-3 pl-12 pr-4 text-lg text-pista-charcoal shadow-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-pista-red"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-2 rounded-lg bg-pista-red px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-pista-red/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Consultar"
            )}
          </button>
        </form>

        {status === "idle" && (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {pasos.map(({ icon: Icon, titulo, texto }, i) => (
              <div
                key={titulo}
                className="animate-fade-in-up rounded-xl border border-pista-slate/10 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:shadow-md"
                style={{ animationDelay: `${180 + i * 90}ms` }}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pista-red/10">
                  <Icon className="text-pista-red" size={22} />
                </div>
                <h3 className="text-sm font-semibold text-pista-charcoal">
                  {titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-pista-slate">
                  {texto}
                </p>
              </div>
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-lg border border-pista-red/30 bg-pista-red/5 px-4 py-3 text-pista-red">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {status === "success" && data && (
          <div className="grid animate-fade-in grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-md sm:flex-row">
              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
                <AnilloProgreso porcentaje={data.porcentaje_asistencia} />
                <span className="absolute text-2xl font-bold text-pista-charcoal">
                  {data.porcentaje_asistencia}%
                </span>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-pista-slate">
                  C.I. consultado
                </p>
                <p className="text-4xl font-bold text-pista-charcoal">{data.ci}</p>
                <p className="mt-2 text-sm text-pista-slate">
                  Porcentaje de asistencia
                </p>
              </div>
            </div>

            <div
              className={`flex h-full flex-col items-center justify-center rounded-xl border p-6 text-center shadow-md transition-all duration-200 ${
                esAprobado
                  ? "border-emerald-100 bg-emerald-50"
                  : "border-pista-red bg-pista-red"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  esAprobado ? "text-pista-slate" : "text-white/80"
                }`}
              >
                Certificación Univalle
              </p>
              <p
                className={`mt-3 text-3xl font-bold ${
                  esAprobado ? "text-emerald-700" : "text-white"
                }`}
              >
                {data.estado_certificacion}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md md:col-span-2">
              <p className="mb-4 text-sm font-medium text-pista-slate">
                Matriz de módulos
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {data.modulos.map((modulo) => (
                  <div
                    key={modulo.numero}
                    className={`flex flex-col items-center gap-1 rounded-lg p-3 transition-all duration-200 ${
                      modulo.asistio ? "bg-emerald-50" : "bg-pista-slate/10"
                    }`}
                  >
                    {modulo.asistio ? (
                      <CheckCircle className="text-emerald-600" size={20} />
                    ) : (
                      <XCircle className="text-pista-slate" size={20} />
                    )}
                    <span className="text-xs font-medium text-pista-charcoal">
                      Módulo {modulo.numero}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-md md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-pista-slate">
                ¿Encontraste un error en tu registro? Comunícate con el equipo
                de coordinación de Pista 8 para solicitar una revisión.
              </p>
              <a
                href={WHATSAPP_SOPORTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2 rounded-lg bg-pista-red px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-pista-red/90"
              >
                <MessageCircle size={18} />
                Consultar registro
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
