import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-art',
  template: `
    <svg viewBox="0 0 360 220" fill="none" aria-hidden="true" focusable="false">
      @switch (variant) {
        @case ('commerce') {
          <g class="float">
            <rect x="55" y="40" width="250" height="145" rx="12" fill="#101c2e" stroke="#9e8fff"/>
            <path d="M55 66h250" stroke="#9e8fff"/>
            <g stroke="#9e8fff"><rect x="73" y="83" width="54" height="60" rx="5"/><rect x="139" y="83" width="54" height="60" rx="5"/></g>
            <path d="m86 98 14-7 14 7v19l-14 7-14-7zm66 0 14-7 14 7v19l-14 7-14-7z" stroke="#63f5d2"/>
            <path d="M84 155h30m36 0h30" stroke="#697d96" stroke-width="4" stroke-linecap="round"/>
            <g class="pulse"><path d="M215 96h10l7 34h43l8-24h-55" stroke="#63f5d2" stroke-width="3" stroke-linejoin="round"/><circle cx="237" cy="143" r="4" fill="#9e8fff"/><circle cx="270" cy="143" r="4" fill="#9e8fff"/></g>
          </g>
        }
        @case ('dashboard') {
          <g class="float">
            <rect x="55" y="40" width="250" height="145" rx="12" fill="#101c2e" stroke="#9e8fff"/>
            <path d="M55 66h250M105 66v119M68 86h24m-24 16h24m-24 16h18" stroke="#697d96"/>
            <rect x="119" y="80" width="75" height="24" rx="4" stroke="#63f5d2"/><rect x="207" y="80" width="80" height="24" rx="4" stroke="#9e8fff"/>
            <g class="chart-bars" fill="#63f5d2" fill-opacity=".6"><rect x="127" y="140" width="17" height="27"/><rect x="153" y="125" width="17" height="42"/><rect x="179" y="114" width="17" height="53"/></g>
            <path class="pulse" d="m211 159 18-22 17 8 31-29" stroke="#9e8fff" stroke-width="3"/>
            <path d="M118 168h170" stroke="#697d96"/>
          </g>
        }
        @case ('integrations') {
          <path class="integration-flow" d="M96 77 160 107m40 0 64-30M96 156l64-34m40 0 64 34" stroke="#63f5d2" stroke-width="2" stroke-dasharray="6 8"/>
          <g stroke="#9e8fff" fill="#101c2e"><rect x="51" y="51" width="58" height="50" rx="8"/><rect x="251" y="51" width="58" height="50" rx="8"/><rect x="51" y="136" width="58" height="50" rx="8"/><rect x="251" y="136" width="58" height="50" rx="8"/></g>
          <g class="pulse"><circle cx="180" cy="115" r="32" fill="#101c2e" stroke="#63f5d2"/><path d="m171 104-10 11 10 11m18-22 10 11-10 11" stroke="#63f5d2" stroke-width="2"/></g>
          <path d="M65 66h30m-30 12h22m-22 76h30m-30 12h22m178-100h30m-30 12h22m-22 76h30m-30 12h22" stroke="#697d96" stroke-width="3"/>
        }
        @case ('responsive') {
          <g class="device-desktop">
            <rect x="20" y="28" width="264" height="154" rx="10" fill="#101c2e" stroke="#9e8fff" stroke-width="1.5"/>
            <path d="M20 52h264M130 182v16m44-16v16m-62 0h80" stroke="#9e8fff" stroke-width="1.5"/>
            <circle cx="35" cy="40" r="3" fill="#63f5d2"/>
            <path d="M45 40h25m128 0h16m10 0h16m10 0h16" stroke="#697d96" stroke-width="3" stroke-linecap="round"/>
            @for (layout of layouts; track $index; let i = $index) {
              <g class="site-variant" [class.variant-first]="i === 0" [style.animation-delay]="-12 + i * 3 + 's'">
                @for (box of layout.desktop; track $index) {
                  <rect [attr.x]="box[0]" [attr.y]="box[1]" [attr.width]="box[2]" [attr.height]="box[3]" rx="3" [attr.fill]="box[4]" [attr.fill-opacity]="box[5] ?? 1" [attr.stroke]="box[6] ?? 'none'"/>
                }
              </g>
            }
          </g>
          <g class="device-phone">
            <rect x="250" y="71" width="90" height="140" rx="13" fill="#0b1423" stroke="#63f5d2" stroke-width="1.5"/>
            <path d="M285 79h20M287 203h16" stroke="#697d96" stroke-width="3" stroke-linecap="round"/>
            <circle cx="263" cy="94" r="3" fill="#63f5d2"/>
            <path d="M316 91h12m-12 4h12m-12 4h12" stroke="#9e8fff" stroke-width="1.5"/>
            @for (layout of layouts; track $index; let i = $index) {
              <g class="site-variant" [class.variant-first]="i === 0" [style.animation-delay]="-12 + i * 3 + 's'">
                @for (box of layout.mobile; track $index) {
                  <rect [attr.x]="box[0]" [attr.y]="box[1]" [attr.width]="box[2]" [attr.height]="box[3]" rx="2" [attr.fill]="box[4]" [attr.fill-opacity]="box[5] ?? 1" [attr.stroke]="box[6] ?? 'none'"/>
                }
              </g>
            }
          </g>
        }
        @case ('presentation') {
          <rect x="55" y="40" width="250" height="145" rx="12" fill="#101c2e" stroke="#9e8fff"/>
          <path d="M55 66h250" stroke="#9e8fff"/>
          <g class="assemble assemble-brand">
            <rect x="71" y="49" width="9" height="9" rx="2" fill="#63f5d2"/>
            <path d="M87 53h35m103 0h13m10 0h13m10 0h13" stroke="#697d96" stroke-width="3" stroke-linecap="round"/>
          </g>
          <g class="assemble assemble-copy">
            <rect x="73" y="82" width="106" height="8" rx="3" fill="#e9f0fa"/>
            <rect x="73" y="96" width="78" height="8" rx="3" fill="#e9f0fa"/>
            <path d="M73 116h98m-98 9h75" stroke="#697d96" stroke-width="3" stroke-linecap="round"/>
          </g>
          <g class="assemble assemble-image">
            <rect x="205" y="80" width="81" height="51" rx="5" fill="#9e8fff" fill-opacity=".12" stroke="#9e8fff"/>
            <circle cx="265" cy="93" r="5" fill="#63f5d2"/>
            <path d="m213 123 18-23 15 16 10-9 22 16" stroke="#63f5d2" stroke-width="2" stroke-linejoin="round"/>
          </g>
          <g class="assemble assemble-first"><rect x="73" y="146" width="62" height="24" rx="4" stroke="#63f5d2"/><path d="M84 158h39" stroke="#697d96" stroke-width="3"/></g>
          <g class="assemble assemble-second"><rect x="148" y="146" width="62" height="24" rx="4" stroke="#63f5d2"/><path d="M159 158h39" stroke="#697d96" stroke-width="3"/></g>
          <g class="assemble assemble-third"><rect x="223" y="146" width="62" height="24" rx="4" stroke="#63f5d2"/><path d="M234 158h39" stroke="#697d96" stroke-width="3"/></g>
        }
        @case ('landing') {
          <rect x="55" y="40" width="250" height="145" rx="12" fill="#101c2e" stroke="#9e8fff"/>
          <path d="M55 66h250" stroke="#9e8fff"/>
          <circle cx="75" cy="53" r="3" fill="#63f5d2"/>
          <rect x="115" y="83" width="130" height="9" rx="4" fill="#dce8f6"/>
          <path d="M130 107h100m-85 10h70" stroke="#697d96" stroke-width="4" stroke-linecap="round"/>
          <rect x="137" y="134" width="86" height="29" rx="6" fill="#63f5d2"/>
          <path d="M162 149h35m-7-6 7 6-7 6" stroke="#101c2e" stroke-width="2"/>
          <circle class="click-wave" cx="206" cy="153" r="15" stroke="#63f5d2" stroke-width="2"/>
          <path class="cta-cursor" d="m206 153 5 25 6-8 10-2z" fill="#e9f0fa" stroke="#101c2e" stroke-width="2" stroke-linejoin="round"/>
        }
        @case ('redesign') {
          <rect x="55" y="40" width="250" height="145" rx="12" fill="#101c2e" stroke="#697d96"/>
          <path d="M55 66h250" stroke="#697d96"/>
          <g fill="#43516a">
            <rect x="70" y="82" width="48" height="88" rx="2"/>
            <rect x="128" y="82" width="156" height="5" rx="2"/>
            <rect x="128" y="96" width="130" height="5" rx="2"/>
            <rect x="128" y="110" width="147" height="5" rx="2"/>
            <rect x="128" y="127" width="58" height="43" rx="2"/>
            <rect x="195" y="127" width="89" height="18" rx="2"/>
          </g>
          <g class="redesign-reveal">
            <rect x="55" y="40" width="250" height="145" rx="12" fill="#101c2e" stroke="#9e8fff"/>
            <path d="M55 66h250" stroke="#9e8fff"/>
            <circle cx="75" cy="53" r="3" fill="#63f5d2"/>
            <rect x="77" y="83" width="115" height="11" rx="3" fill="#e9f0fa"/>
            <path d="M77 109h97m-97 12h75" stroke="#697d96" stroke-width="4" stroke-linecap="round"/>
            <rect x="77" y="140" width="65" height="20" rx="5" fill="#63f5d2"/>
            <rect x="213" y="83" width="68" height="77" rx="6" fill="#9e8fff" fill-opacity=".15" stroke="#9e8fff"/>
            <path d="m227 137 20-38 20 38z" stroke="#63f5d2" stroke-width="2"/>
          </g>
          <g class="redesign-slider">
            <path d="M180 33v159" stroke="#63f5d2" stroke-width="2"/>
            <circle cx="180" cy="112" r="12" fill="#101c2e" stroke="#63f5d2" stroke-width="2"/>
            <path d="m176 108-4 4 4 4m8-8 4 4-4 4" stroke="#63f5d2" stroke-width="1.5"/>
          </g>
        }
        @case ('orbit') {
          <g class="scroll-rotate">
            <ellipse cx="180" cy="110" rx="130" ry="60" stroke="#63f5d2" transform="rotate(-25 180 110)"/>
            <ellipse cx="180" cy="110" rx="130" ry="60" stroke="#9e8fff" transform="rotate(35 180 110)"/>
            <circle cx="180" cy="110" r="35" stroke="#63f5d2" stroke-dasharray="4 7"/>
          </g>
          <g class="pulse"><circle cx="180" cy="110" r="12" fill="#63f5d2"/><circle cx="69" cy="159" r="6" fill="#9e8fff"/></g>
        }
        @case ('path') {
          <path d="M25 175C70 175 65 50 130 50S190 170 245 130 280 40 335 40" stroke="#29465d" stroke-width="2"/>
          <path class="draw-path" pathLength="650" d="M25 175C70 175 65 50 130 50S190 170 245 130 280 40 335 40" stroke="#63f5d2" stroke-width="3" stroke-dasharray="650"/>
          <g class="pulse" fill="#101c2e" stroke="#9e8fff" stroke-width="2"><circle cx="25" cy="175" r="9"/><circle cx="130" cy="50" r="9"/><circle cx="245" cy="130" r="9"/><circle cx="335" cy="40" r="9"/></g>
        }
        @case ('layers') {
          <defs><linearGradient [attr.id]="gradientId" x1="180" y1="25" x2="180" y2="140" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#63f5d2" stop-opacity=".45"/><stop offset=".5" stop-color="#63f5d2" stop-opacity=".35"/><stop offset="1" stop-color="#63f5d2" stop-opacity="0"/></linearGradient></defs>
          <g class="float layer-lines"><path d="m180 25 140 65-140 65L40 90z" fill="#63f5d20a" stroke="#63f5d2" vector-effect="non-scaling-stroke"/><path d="m40 120 140 65 140-65M40 150l140 65 140-65" stroke="#9e8fff" vector-effect="non-scaling-stroke"/><path d="M180 27V140" [attr.stroke]="'url(#' + gradientId + ')'" vector-effect="non-scaling-stroke"/></g>
        }
        @default {
          <g class="float"><rect x="55" y="40" width="250" height="145" rx="12" stroke="#9e8fff"/><path d="M55 72h250" stroke="#9e8fff"/><circle cx="75" cy="56" r="3" fill="#63f5d2"/><path d="m135 102-25 25 25 25m90-50 25 25-25 25m-30-60-30 70" stroke="#63f5d2" stroke-width="3"/></g>
        }
      }
    </svg>`,
  styles: [`
    :host{display:block;pointer-events:none}svg{width:100%;height:auto;overflow:visible}
    .scroll-rotate{transform-origin:180px 110px;transform:rotate(var(--scroll-turn,0deg))}
    .draw-path{stroke-dashoffset:var(--scroll-dash,325)}
    .layer-lines path{stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
    .float.layer-lines{animation:portfolio-float 5s ease-in-out infinite}
    @keyframes portfolio-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-28px)}}
    .float{animation:section-float 7s ease-in-out infinite}.pulse{animation:section-pulse 5s ease-in-out infinite}
    @keyframes section-float{50%{transform:translateY(-12px)}}@keyframes section-pulse{50%{opacity:.45}}
    .cta-cursor{animation:cta-approach 5s ease-in-out infinite}
    .chart-bars{transform-origin:160px 168px;animation:chart-grow 5s ease-in-out infinite}
    @keyframes chart-grow{0%,100%{transform:scaleY(.5)}50%{transform:scaleY(1)}}
    .integration-flow{animation:integration-flow 5s linear infinite}
    @keyframes integration-flow{to{stroke-dashoffset:-140}}
    .device-desktop{animation:section-float 9s ease-in-out infinite}
    .device-phone{animation:section-float 7s ease-in-out infinite reverse}
    .site-variant{opacity:0;animation:site-cycle 12s linear infinite}
    .variant-first{opacity:1}
    @keyframes site-cycle{0%,21%{opacity:1}25%,96%{opacity:0}100%{opacity:1}}
    .assemble{animation:site-assemble 8s ease-in-out infinite;opacity:1}
    .assemble-copy{animation-delay:.3s}.assemble-image{animation-delay:.6s}
    .assemble-first{animation-delay:.9s}.assemble-second{animation-delay:1.2s}.assemble-third{animation-delay:1.5s}
    @keyframes site-assemble{0%,5%,100%{opacity:0;transform:translateY(9px)}16%,78%{opacity:1;transform:translateY(0)}90%{opacity:0;transform:translateY(0)}}
    .click-wave{transform-origin:206px 153px;opacity:0;animation:cta-wave 5s ease-out infinite}
    @keyframes cta-approach{0%,15%,100%{transform:translate(48px,22px)}40%,75%{transform:translate(0,0)}48%{transform:translate(0,2px)}}
    @keyframes cta-wave{0%,45%,80%,100%{opacity:0;transform:scale(.3)}48%{opacity:.85;transform:scale(.3)}72%{opacity:0;transform:scale(2)}}
    .redesign-reveal{clip-path:inset(0 50% 0 0);animation:redesign-wipe 7s ease-in-out infinite}
    .redesign-slider{animation:redesign-handle 7s ease-in-out infinite}
    @keyframes redesign-wipe{0%,15%,100%{clip-path:inset(0 78% 0 0)}50%,70%{clip-path:inset(0 22% 0 0)}}
    @keyframes redesign-handle{0%,15%,100%{transform:translateX(-100.8px)}50%,70%{transform:translateX(100.8px)}}
    :host-context(.motion-paused) *{animation-play-state:paused!important}
    @media(prefers-reduced-motion:reduce){*{animation:none!important}.scroll-rotate{transform:none}.draw-path{stroke-dashoffset:0}}
  `],
})
export class SectionArt {
  @Input() variant = 'code';
  @Input() gradientId = 'layer-axis-fade';
  // Matching desktop/mobile compositions: business, campaign, portfolio, editorial.
  protected readonly layouts: { desktop: (string | number)[][]; mobile: (string | number)[][] }[] = [
    {
      desktop: [[38,70,110,9,'#e9f0fa'],[38,90,130,4,'#697d96'],[38,101,95,4,'#697d96'],[198,66,66,46,'#9e8fff',.2,'#9e8fff'],[38,126,65,36,'#63f5d2',.15,'#63f5d2'],[115,126,65,36,'#9e8fff',.15,'#9e8fff'],[192,126,65,36,'#9e8fff',.15,'#9e8fff']],
      mobile: [[262,109,53,5,'#e9f0fa'],[262,120,65,3,'#697d96'],[262,130,66,22,'#9e8fff',.2,'#9e8fff'],[262,159,66,8,'#63f5d2',.5],[262,173,66,8,'#9e8fff',.4],[262,187,66,8,'#9e8fff',.4]],
    },
    {
      desktop: [[38,65,226,62,'#63f5d2',.08,'#63f5d2'],[88,76,126,10,'#e9f0fa'],[104,96,94,4,'#697d96'],[120,109,62,12,'#63f5d2'],[72,140,50,22,'#9e8fff',.3],[137,140,50,22,'#9e8fff',.3],[202,140,50,22,'#9e8fff',.3]],
      mobile: [[261,109,67,49,'#63f5d2',.08,'#63f5d2'],[268,118,52,6,'#e9f0fa'],[272,132,43,3,'#697d96'],[277,143,34,9,'#63f5d2'],[262,166,66,11,'#9e8fff',.3],[262,184,66,11,'#9e8fff',.3]],
    },
    {
      desktop: [[38,66,72,9,'#e9f0fa'],[38,86,105,77,'#9e8fff',.3,'#9e8fff'],[155,86,109,33,'#63f5d2',.2,'#63f5d2'],[155,130,109,33,'#9e8fff',.15,'#9e8fff']],
      mobile: [[262,109,46,5,'#e9f0fa'],[262,123,66,37,'#9e8fff',.3,'#9e8fff'],[262,167,66,12,'#63f5d2',.2,'#63f5d2'],[262,186,66,10,'#9e8fff',.15,'#9e8fff']],
    },
    {
      desktop: [[38,66,102,9,'#e9f0fa'],[38,88,80,74,'#63f5d2',.15,'#63f5d2'],[132,88,89,6,'#e9f0fa'],[132,104,130,4,'#697d96'],[132,115,118,4,'#697d96'],[132,126,130,4,'#697d96'],[132,137,99,4,'#697d96'],[132,151,46,10,'#9e8fff']],
      mobile: [[262,109,55,5,'#e9f0fa'],[262,123,66,32,'#63f5d2',.15,'#63f5d2'],[262,164,53,5,'#e9f0fa'],[262,175,66,3,'#697d96'],[262,183,60,3,'#697d96'],[262,191,65,3,'#697d96']],
    },
  ];
}



