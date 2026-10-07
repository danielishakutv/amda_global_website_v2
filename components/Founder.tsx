"use client";

import Image from "next/image";
import { Linkedin } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";
import { useSiteContent } from "@/lib/content-store";
import type { TeamMember } from "@/lib/site-content";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Founder() {
  const content = useSiteContent();
  const founder = content.founder;
  const team = content.team ?? [];

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="section bg-navy-deep text-white"
    >
      <div className="container relative">
        <div className="max-w-3xl">
          <Reveal>
            <SectionTag variant="dark">Our Team</SectionTag>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="team-heading"
              className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight"
            >
              {team.length > 0 ? (
                <>Meet the <span className="italic text-gold-soft">Team</span></>
              ) : (
                <>Meet the <span className="italic text-gold-soft">Founder</span></>
              )}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base text-white/65 sm:text-lg">
              The people who show up for your brand every day.
            </p>
          </Reveal>
        </div>

        {/* Founder */}
        <div className="mt-16">
          <Reveal>
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md sm:flex-row">
              <div className="relative w-full shrink-0 bg-navy sm:w-72">
                {founder.photo ? (
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    width={576}
                    height={864}
                    sizes="(max-width: 640px) 100vw, 288px"
                    className="h-72 w-full object-cover object-top sm:h-full sm:min-h-[26rem]"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-72 place-items-center sm:h-full sm:min-h-[26rem]">
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-gold/15 font-display text-2xl font-semibold text-gold-soft">
                      {initials(founder.name)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-8 sm:p-10">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
                  Founder
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
                  {founder.name}
                </h3>
                <p className="mt-1 text-sm text-white/60">{founder.title}</p>
                <p className="mt-5 flex-1 text-sm leading-relaxed text-white/75">{founder.bio}</p>
                {founder.linkedin && (
                  <div className="mt-7">
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold-soft"
                    >
                      <Linkedin size={15} />
                      View LinkedIn profile
                    </a>
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        </div>

        {/* Team members added in Admin → Founder & Team */}
        {team.length > 0 && (
          <div className="mt-6">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m, i) => (
                <Reveal key={m.id} as="li" delay={0.04 + (i % 3) * 0.05}>
                  <TeamCard member={m} />
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md">
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.name}
          width={600}
          height={450}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="aspect-[4/3] w-full object-cover object-top"
          loading="lazy"
        />
      ) : (
        <div className="grid aspect-[4/3] place-items-center bg-white/[0.03]">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-gold/15 font-display text-xl font-semibold text-gold-soft">
            {initials(member.name)}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-white">{member.name}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold-soft">
          {member.role}
        </p>
        {member.bio && (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">{member.bio}</p>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-gold hover:text-gold-soft"
          >
            <Linkedin size={13} />
            LinkedIn
          </a>
        )}
      </div>
    </article>
  );
}
