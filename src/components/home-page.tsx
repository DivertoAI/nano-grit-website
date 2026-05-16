"use client";

import { CarScene } from "@/components/3d/car-scene";
import { EngineLoader } from "@/components/loader/engine-loader";
import { SectionReveal } from "@/components/ui/section-reveal";
import { WorkMediaModal } from "@/components/ui/work-media-modal";
import {
  BOOKING_ELIGIBILITY_RULES,
  BOOKING_HIGHLIGHTS,
  BOOKING_MODES,
  BENEFITS,
  BRAND,
  CONTACT_DEFAULTS,
  FAQS,
  HERO_COLLAGE,
  SERVICE_GROUPS,
  PACKAGES,
  PROCESS,
  STATS,
  TESTIMONIALS,
  WORKS,
  WorkMediaItem,
} from "@/content/site";
import { useParallax } from "@/lib/parallax";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  serviceGroup: string;
  serviceType: string;
  bookingMode: "solutions" | "onsite" | "pickup-drop";
  isPremiumVehicle: boolean;
  closedAreaAvailable: boolean;
  waterAvailable: boolean;
  electricAvailable: boolean;
  pickupAddress: string;
  preferredDate: string;
  designBrief: string;
};

const initialFormState: ContactFormState = {
  name: "",
  phone: "",
  email: "",
  vehicleType: CONTACT_DEFAULTS.vehicleType,
  serviceGroup: CONTACT_DEFAULTS.serviceGroup,
  serviceType: CONTACT_DEFAULTS.serviceType,
  bookingMode: CONTACT_DEFAULTS.bookingMode,
  isPremiumVehicle: false,
  closedAreaAvailable: false,
  waterAvailable: false,
  electricAvailable: false,
  pickupAddress: "",
  preferredDate: "",
  designBrief: "",
};

export function HomePage() {
  const [carReady, setCarReady] = useState(false);
  const [carFailed, setCarFailed] = useState(false);
  const [mobileReady, setMobileReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [hasSeenLoader, setHasSeenLoader] = useState(false);
  const [activeWork, setActiveWork] = useState<WorkMediaItem | null>(null);
  const [activePreviewSrc, setActivePreviewSrc] = useState<string | null>(null);
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const worksRef = useRef<HTMLElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const bootStartRef = useRef<number | null>(null);
  const loaderHiddenRef = useRef(false);
  const heroVisibleMarkedRef = useRef(false);
  const workPreviewMarkedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const trackMetric = (name: string, value: number) => {
    const rounded = Math.round(value);
    if (typeof window !== "undefined") {
      console.info(`[perf] ${name}: ${rounded}ms`);
      window.dispatchEvent(
        new CustomEvent("nano-grit-perf", { detail: { name, value: rounded } }),
      );
    }
  };

  useEffect(() => {
    bootStartRef.current = performance.now();
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const seenLoader = window.sessionStorage.getItem("nano-grit-loader-seen") === "1";
    setHasSeenLoader(seenLoader);
    if (seenLoader) {
      setShowLoader(false);
    }
  }, []);

  useEffect(() => {
    if (showLoader) return;
    window.sessionStorage.setItem("nano-grit-loader-seen", "1");
    if (!loaderHiddenRef.current && bootStartRef.current !== null) {
      loaderHiddenRef.current = true;
      trackMetric("hero_loader_ms", performance.now() - bootStartRef.current);
    }
  }, [showLoader]);

  useEffect(() => {
    if (hasSeenLoader) return;
    // Absolute safety cap — only fires if the model never signals ready or failed
    const absoluteCap = window.setTimeout(() => setShowLoader(false), 25000);
    return () => window.clearTimeout(absoluteCap);
  }, [hasSeenLoader]);

  useEffect(() => {
    if (!showLoader) return;
    // Hide loader as soon as the model is ready (or failed, or mobile video ready)
    const modelReady = !isMobile ? (carReady || carFailed) : mobileReady;
    if (modelReady || prefersReducedMotion) {
      const timer = window.setTimeout(() => setShowLoader(false), 180);
      return () => window.clearTimeout(timer);
    }
  }, [carReady, carFailed, isMobile, mobileReady, prefersReducedMotion, showLoader]);

  useEffect(() => {
    if (heroVisibleMarkedRef.current || bootStartRef.current === null) return;
    heroVisibleMarkedRef.current = true;
    trackMetric("hero_first_interactive_ms", performance.now() - bootStartRef.current);
  }, []);

  useEffect(() => {
    if (!carReady || bootStartRef.current === null) return;
    trackMetric("hero_3d_ready_ms", performance.now() - bootStartRef.current);
  }, [carReady]);

  const heroNear = useParallax(heroRef, {
    yIn: [0, 1],
    yOut: isMobile ? [10, -10] : [24, -18],
    scaleOut: [1, 1.03],
  });
  const heroMid = useParallax(heroRef, {
    yIn: [0, 1],
    yOut: isMobile ? [6, -6] : [14, -12],
  });
  const heroFar = useParallax(heroRef, {
    yIn: [0, 1],
    yOut: isMobile ? [4, -4] : [8, -8],
  });
  const worksLift = useParallax(worksRef, {
    yIn: [0, 1],
    yOut: [14, -10],
  });
  const statsLift = useParallax(statsRef, {
    yIn: [0, 1],
    yOut: [18, -14],
  });

  const collageByTier = useMemo(
    () => ({
      near: heroNear,
      mid: heroMid,
      far: heroFar,
    }),
    [heroFar, heroMid, heroNear],
  );

  const selectedServiceGroup = useMemo(
    () =>
      SERVICE_GROUPS.find((group) => group.title === form.serviceGroup) ?? SERVICE_GROUPS[0],
    [form.serviceGroup],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.designBrief.trim()) {
      setError("Please enter name, phone, and service requirement.");
      setSubmitted(false);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          sourceUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error("booking_submit_failed");
      }

      setSubmitted(true);
      setForm(initialFormState);
    } catch {
      setSubmitted(false);
      setError("Booking submit failed. Please use the WhatsApp button below.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <EngineLoader visible={showLoader} />
      <main className="pb-16">
        <section ref={heroRef} className="shell pt-10 md:pt-16">
          <div className="hero-shell parallax-container relative overflow-hidden rounded-[2rem] px-6 pb-8 pt-10 md:px-10 md:pb-12 md:pt-12">
            <div className="pointer-events-none absolute inset-0 z-0">
              <div className="hero-collage">
                {HERO_COLLAGE.map((item) => {
                  const parallax = collageByTier[item.tier];
                  return (
                    <motion.div
                      key={item.src}
                      aria-hidden="true"
                      className={`hero-collage-tile ${item.className}`}
                      style={{
                        y: parallax.y,
                        scale: parallax.scale,
                      }}
                    >
                      <Image src={item.src} alt={item.alt} fill className="object-cover" />
                    </motion.div>
                  );
                })}
              </div>
              <div className="hero-vignette" />
              <div className="hero-copy-mask absolute left-0 top-0 h-full w-full md:w-[52%]" />
            </div>

            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.02fr_1.2fr]">
              <SectionReveal>
                <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-white/55 bg-white/70 px-3 py-2 backdrop-blur">
                  <Image
                    src="/brand/nano-grit-logo-cutout.png"
                    alt="Nano Grit logo"
                    width={40}
                    height={40}
                    className="h-9 w-auto"
                  />
                  <p className="display-font text-base uppercase tracking-[0.16em] text-slate-900">
                    Nano Grit
                  </p>
                </div>
                <motion.p
                  className="parallax-layer-far text-xs font-bold uppercase tracking-[0.29em] text-[var(--accent-strong)]"
                  style={{ y: heroFar.y }}
                >
                  Premium Auto Detailing
                </motion.p>
                <h1 className="display-font mt-3 text-6xl leading-[0.88] tracking-[0.04em] text-slate-900 md:text-8xl">
                  NANO GRIT
                </h1>
                <h2 className="mt-2 text-2xl font-semibold text-slate-800 md:text-3xl">
                  Detailing &amp; Coating Solutions
                </h2>
                <motion.p
                  className="parallax-layer-far mt-4 max-w-xl text-base text-slate-700 md:text-lg"
                  style={{ y: heroMid.y }}
                >
                  When paint starts feeling tired, ownership pride drops. We bring that
                  feeling back with obsessive prep, correction, and coating precision.
                </motion.p>
                <motion.p
                  className="parallax-layer-far mt-3 max-w-xl text-sm text-muted"
                  style={{ y: heroMid.y }}
                >
                  {BRAND.subtitle}
                </motion.p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="#contact"
                    className="glow-pill rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-white"
                  >
                    ✨ Get a Quote
                  </Link>
                  <a
                    href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20Nano%20Grit,%20I%20want%20to%20book%20detailing.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-700/25 bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.11em] text-white shadow-[0_10px_28px_rgba(16,185,129,0.34)]"
                  >
                    <Image
                      src="/icons/whatsapp-mark.svg"
                      alt="WhatsApp"
                      width={18}
                      height={18}
                    />
                    WhatsApp Us
                  </a>
                  <a
                    href={BRAND.phoneHref}
                    className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.11em] text-slate-700"
                  >
                    📞 Call Now
                  </a>
                </div>
              </SectionReveal>

              <SectionReveal>
                <motion.div className="parallax-layer-mid" style={{ y: heroMid.y }}>
                  <div className="relative h-[21rem] w-full overflow-hidden rounded-[1.7rem] border border-white/55 bg-[linear-gradient(145deg,rgba(6,11,20,0.97)_0%,rgba(12,19,35,0.95)_48%,rgba(27,14,32,0.96)_100%)] shadow-[0_30px_80px_rgba(8,17,35,0.32)] md:h-[29rem]">
                    <div className="pointer-events-none absolute inset-x-[9%] top-[-18%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_60%)] blur-3xl" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(244,63,94,0.2),transparent_32%),linear-gradient(180deg,transparent_0%,rgba(2,6,23,0.35)_100%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(120deg,rgba(148,163,184,0.045),rgba(148,163,184,0.045)_11px,transparent_11px,transparent_28px)]" />
                    <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200 backdrop-blur">
                      Interactive Solutions View
                    </div>
                    {isMobile ? (
                      <div className="relative h-full w-full">
                        <video
                          className="h-full w-full object-cover"
                          poster="/media/posters/work-02.jpg"
                          muted
                          loop
                          autoPlay
                          playsInline
                          preload="none"
                          onLoadedData={() => setMobileReady(true)}
                        >
                          <source src="/media/videos/work-02.mp4" type="video/mp4" />
                        </video>
                      </div>
                    ) : (
                      <div className="absolute inset-0">
                        <CarScene
                          posterSrc="/media/posters/work-03.jpg"
                          onReady={() => setCarReady(true)}
                          onError={() => {
                            setCarFailed(true);
                            if (bootStartRef.current !== null) {
                              trackMetric(
                                "hero_3d_fallback_used",
                                performance.now() - bootStartRef.current,
                              );
                            }
                          }}
                          ready={carReady}
                          mountWhenVisible={false}
                          fallbackTimeoutMs={20000}
                        />
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent_0%,rgba(2,6,23,0.28)_35%,rgba(2,6,23,0.82)_100%)]" />
                    {!isMobile && !carFailed ? (
                      <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-cyan-300/25 bg-slate-950/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100 backdrop-blur">
                        Drag to rotate · Scroll to zoom
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              </SectionReveal>
            </div>
          </div>
        </section>

        <section ref={worksRef} className="shell mt-12">
          <div className="workshop-band parallax-container rounded-[1.6rem] px-6 py-8 md:px-8 md:py-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionReveal>
                <motion.div className="parallax-layer-far" style={{ y: worksLift.y }}>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-200">
                    Our Works
                  </p>
                  <h3 className="display-font mt-3 text-5xl tracking-[0.04em] text-white md:text-6xl">
                    Real Surfaces. Real Correction.
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
                    Every clip here is from our workshop floor. The same lights, the same
                    defects, the same hand-finished detail process that leads to delivery-day
                    pride.
                  </p>
                </motion.div>
              </SectionReveal>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-100 hover:bg-white/20"
              >
                See More <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-12">
              {WORKS.slice(0, 5).map((item, index) => (
                <SectionReveal key={item.title} className={`work-card group overflow-hidden rounded-[1.1rem] border border-white/12 ${item.span}`} delay={index * 0.05}>
                  <motion.div
                    className={index % 2 === 0 ? "parallax-layer-near" : "parallax-layer-mid"}
                    style={{ y: index % 2 === 0 ? worksLift.y : heroFar.y }}
                  >
                    <button
                      type="button"
                      className="block w-full text-left"
                      aria-label={`Open ${item.title} in popup`}
                      onClick={() => setActiveWork(item)}
                    >
                      <div
                        className={item.heightClass}
                        onMouseEnter={() => {
                          if (isMobile || item.mediaType !== "video") return;
                          setActivePreviewSrc(item.src);
                          if (!workPreviewMarkedRef.current && bootStartRef.current !== null) {
                            workPreviewMarkedRef.current = true;
                            trackMetric(
                              "works_preview_start_ms",
                              performance.now() - bootStartRef.current,
                            );
                          }
                        }}
                        onMouseLeave={() => {
                          if (activePreviewSrc === item.src) {
                            setActivePreviewSrc(null);
                          }
                        }}
                        onFocus={() => {
                          if (isMobile || item.mediaType !== "video") return;
                          setActivePreviewSrc(item.src);
                        }}
                        onBlur={() => {
                          if (activePreviewSrc === item.src) {
                            setActivePreviewSrc(null);
                          }
                        }}
                      >
                        {item.mediaType === "video" && activePreviewSrc === item.src ? (
                          <video
                            className="h-full w-full object-cover"
                            poster={item.poster}
                            muted
                            loop
                            playsInline
                            preload="none"
                            autoPlay
                          >
                            <source src={item.src} type="video/mp4" />
                          </video>
                        ) : (
                          <Image
                            src={item.poster}
                            alt={item.alt}
                            width={1200}
                            height={800}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="work-overlay p-4">
                        <p className="display-font text-2xl tracking-[0.03em] text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.13em] text-blue-100">
                          {item.label}
                        </p>
                        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200/90">
                          Click to expand
                        </p>
                      </div>
                    </button>
                  </motion.div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="shell mt-20 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <SectionReveal className="card p-7 md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
              Why Nano Grit
            </p>
            <h3 className="display-font mt-3 text-5xl tracking-[0.04em] text-slate-900 md:text-6xl">
              Preserve the Feeling.
            </h3>
            <p className="mt-4 max-w-xl text-base text-muted">
              We are not chasing surface shine only. We preserve the feeling of walking back
              to your car, looking at panel lines in the light, and feeling certain it is
              worth protecting.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1} className="dark-band rounded-[1.4rem] border border-slate-700/70 p-7 md:p-10">
            <p className="display-font text-3xl tracking-[0.06em] text-white">
              Process Pipeline
            </p>
            <div className="mt-6 space-y-3">
              {PROCESS.map((step) => (
                <div
                  key={step}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold tracking-[0.06em] text-blue-100"
                >
                  {step}
                </div>
              ))}
            </div>
          </SectionReveal>
        </section>

        <section className="shell mt-14">
          <div ref={statsRef} className="dark-band parallax-container relative overflow-hidden rounded-[1.4rem] border border-slate-700/80 px-6 py-8 md:px-9">
            <motion.div
              aria-hidden="true"
              className="confidence-parallax-bg parallax-layer-far absolute inset-0"
              style={{ y: statsLift.y }}
            />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-200">
                Confidence Layer
              </p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {STATS.map((stat, index) => (
                  <SectionReveal
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-5"
                    delay={index * 0.08}
                  >
                    <p className="display-font text-4xl text-white">{stat.value}</p>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.1em] text-blue-200">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-xs text-slate-300">{stat.note}</p>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="shell mt-20">
          <SectionReveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
              Packages
            </p>
            <h3 className="display-font mt-2 text-5xl tracking-[0.04em] text-slate-900 md:text-6xl">
              Coating Plans
            </h3>
          </SectionReveal>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {PACKAGES.map((item, index) => (
              <SectionReveal key={item.name} className="card p-6" delay={index * 0.07}>
                <div className="flex items-center justify-between">
                  <p className="display-font text-3xl tracking-[0.04em] text-slate-900">
                    {item.name}
                  </p>
                  {item.badge ? (
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-xl font-extrabold text-[var(--accent-strong)]">
                  {item.price}
                </p>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
                <ul className="mt-4 grid gap-2">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </SectionReveal>
            ))}
          </div>
        </section>

        <section className="shell mt-20">
          <SectionReveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
              Testimonials
            </p>
            <h3 className="display-font mt-3 text-5xl tracking-[0.04em] text-slate-900 md:text-6xl">
              Client Feedback
            </h3>
          </SectionReveal>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {TESTIMONIALS.map((item, index) => (
              <SectionReveal key={item.name} className="card p-6" delay={index * 0.07}>
                <p className="text-sm leading-relaxed text-slate-700">&quot;{item.quote}&quot;</p>
                <p className="mt-4 display-font text-2xl tracking-[0.04em] text-slate-900">
                  {item.name}
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  {item.vehicle} | {item.location}
                </p>
              </SectionReveal>
            ))}
          </div>
        </section>

        <section className="shell mt-20 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <SectionReveal className="card p-7 md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
              FAQ
            </p>
            <h3 className="display-font mt-3 text-4xl tracking-[0.04em] text-slate-900 md:text-5xl">
              Detailing Answers
            </h3>
            <div className="mt-6 grid gap-3">
              {FAQS.map((item) => (
                <details
                  key={item.question}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm text-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1} className="card p-7 md:p-8" id="contact">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
              Book Your Slot
            </p>
            <h3 className="display-font mt-3 text-4xl tracking-[0.04em] text-slate-900 md:text-5xl">
              Start Your Shine Journey
            </h3>
            <div className="mt-4 grid gap-2">
              {BOOKING_HIGHLIGHTS.slice(0, 3).map((item) => (
                <p
                  key={item}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-700"
                >
                  {item}
                </p>
              ))}
            </div>
            <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
              <input
                className="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                placeholder="Full Name"
                value={form.name}
                onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
              />
              <input
                className="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(event) => setForm((state) => ({ ...state, phone: event.target.value }))}
              />
              <input
                className="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                placeholder="Email (Optional)"
                value={form.email}
                onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  className="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  value={form.vehicleType}
                  onChange={(event) =>
                    setForm((state) => ({ ...state, vehicleType: event.target.value }))
                  }
                >
                  <option>Car</option>
                  <option>Bike</option>
                  <option>SUV</option>
                  <option>Luxury</option>
                  <option>Supercar</option>
                </select>
                <select
                  className="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  value={form.serviceGroup}
                  onChange={(event) => {
                    setForm((state) => ({
                      ...state,
                      serviceGroup: event.target.value,
                      serviceType:
                        SERVICE_GROUPS.find((group) => group.title === event.target.value)
                          ?.services[0]?.title ?? state.serviceType,
                    }));
                  }}
                >
                  {SERVICE_GROUPS.map((group) => (
                    <option key={group.title}>{group.title}</option>
                  ))}
                </select>
              </div>
              <select
                className="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                value={form.serviceType}
                onChange={(event) =>
                  setForm((state) => ({ ...state, serviceType: event.target.value }))
                }
              >
                {selectedServiceGroup.services.map((service) => (
                  <option key={service.title}>{service.title}</option>
                ))}
              </select>
              <select
                className="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                value={form.bookingMode}
                onChange={(event) =>
                  setForm((state) => ({
                    ...state,
                    bookingMode: event.target.value as ContactFormState["bookingMode"],
                  }))
                }
              >
                {BOOKING_MODES.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                value={form.preferredDate}
                onChange={(event) =>
                  setForm((state) => ({ ...state, preferredDate: event.target.value }))
                }
              />
              <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isPremiumVehicle}
                  onChange={(event) =>
                    setForm((state) => ({
                      ...state,
                      isPremiumVehicle: event.target.checked,
                    }))
                  }
                />
                Premium vehicle (towing can be arranged when required)
              </label>
              <input
                className="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                placeholder="Pickup / Drop address note (if needed)"
                value={form.pickupAddress}
                onChange={(event) =>
                  setForm((state) => ({ ...state, pickupAddress: event.target.value }))
                }
              />
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  Onsite Eligibility Checklist
                </p>
                <div className="mt-2 space-y-2">
                  {BOOKING_ELIGIBILITY_RULES.map((rule) => (
                    <label key={rule.label} className="flex items-center gap-2 text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={
                          rule.label.includes("Closed")
                            ? form.closedAreaAvailable
                            : rule.label.includes("Water")
                              ? form.waterAvailable
                              : form.electricAvailable
                        }
                        onChange={(event) =>
                          setForm((state) => ({
                            ...state,
                            closedAreaAvailable: rule.label.includes("Closed")
                              ? event.target.checked
                              : state.closedAreaAvailable,
                            waterAvailable: rule.label.includes("Water")
                              ? event.target.checked
                              : state.waterAvailable,
                            electricAvailable: rule.label.includes("Electric")
                              ? event.target.checked
                              : state.electricAvailable,
                          }))
                        }
                      />
                      {rule.label}
                    </label>
                  ))}
                </div>
              </div>
              <textarea
                className="focus-ring min-h-28 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                placeholder="Tell us about your vehicle, custom design brief, and desired finish."
                value={form.designBrief}
                onChange={(event) =>
                  setForm((state) => ({ ...state, designBrief: event.target.value }))
                }
              />
              {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
              {submitted ? (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  Inquiry received. Our team will confirm calendar slot and deposit next.
                </p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="glow-pill rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white"
              >
                {submitting ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20Nano%20Grit,%20I%20need%20a%20quote.%0AService%20Group:%20${encodeURIComponent(form.serviceGroup)}%0AService:%20${encodeURIComponent(form.serviceType)}%0ABooking%20Mode:%20${encodeURIComponent(form.bookingMode)}%0APremium%20Vehicle:%20${form.isPremiumVehicle ? "Yes" : "No"}%0AClosed%20Area:%20${form.closedAreaAvailable ? "Yes" : "No"}%0AWater:%20${form.waterAvailable ? "Yes" : "No"}%0AElectric:%20${form.electricAvailable ? "Yes" : "No"}%0APreferred%20Date:%20${encodeURIComponent(form.preferredDate || "Not shared")}%0ANotes:%20${encodeURIComponent(form.designBrief || "Not shared")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700"
              >
                Get Quote on WhatsApp
              </a>
              <a
                href={BRAND.phoneHref}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700"
              >
                {BRAND.phone}
              </a>
              <a
                href={BRAND.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700"
              >
                Open Solutions Map
              </a>
            </div>
          </SectionReveal>
        </section>
      </main>

      <WorkMediaModal item={activeWork} onClose={() => setActiveWork(null)} />
    </>
  );
}
