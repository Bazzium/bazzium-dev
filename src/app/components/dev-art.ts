import { Component } from '@angular/core';

@Component({
  selector: 'app-dev-art',
  template: `
    <svg viewBox="0 0 640 490" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="art-line" x1="70" y1="80" x2="560" y2="420" gradientUnits="userSpaceOnUse"><stop stop-color="#63f5d2"/><stop offset="1" stop-color="#8a7dff"/></linearGradient>
      </defs>
      <g class="orbit"><ellipse cx="320" cy="245" rx="286" ry="182" stroke="url(#art-line)" stroke-opacity=".25" stroke-dasharray="5 12"/><circle cx="57" cy="173" r="5" fill="#63f5d2"/><circle cx="583" cy="315" r="5" fill="#9b90ff"/></g>
      <g class="window">
        <rect x="115" y="90" width="410" height="295" rx="15" fill="#101e33" stroke="url(#art-line)"/>
        <path d="M115 130H525" stroke="#2d3c53"/>
        <circle cx="136" cy="111" r="4" fill="#63f5d2"/><circle cx="152" cy="111" r="4" fill="#8a7dff"/><circle cx="168" cy="111" r="4" fill="#43516a"/>
        <rect x="270" y="105" width="101" height="9" rx="4" fill="#23354c"/>
        <rect x="144" y="159" width="74" height="7" rx="3" fill="#63f5d2"/>
        <rect x="144" y="185" width="191" height="18" rx="4" fill="#e7f0fa"/>
        <rect x="144" y="214" width="141" height="18" rx="4" fill="#e7f0fa"/>
        <rect x="144" y="250" width="169" height="5" rx="2" fill="#51647e"/>
        <rect x="144" y="263" width="144" height="5" rx="2" fill="#51647e"/>
        <rect x="144" y="288" width="97" height="29" rx="6" fill="#63f5d2"/>
        <path d="M211 302h13m-5-5 5 5-5 5" stroke="#0a1928" stroke-width="2"/>
        <g class="gem"><path d="m416 166 61 35v70l-61 35-61-35v-70z" fill="#8a7dff" fill-opacity=".12" stroke="url(#art-line)" stroke-width="2"/><path d="m355 201 61 35 61-35m-61 35v70m0-140v70" stroke="url(#art-line)" stroke-width="2"/><circle cx="416" cy="236" r="9" fill="#63f5d2"/></g>
        <rect x="144" y="342" width="99" height="18" rx="4" fill="#1c2d44"/><rect x="257" y="342" width="99" height="18" rx="4" fill="#1c2d44"/><rect x="370" y="342" width="125" height="18" rx="4" fill="#1c2d44"/>
      </g>
      <g class="float-left"><rect x="45" y="274" width="99" height="87" rx="12" fill="#12243a" stroke="#63f5d2" stroke-opacity=".5"/><path d="m80 299-13 17 13 17m29-34 13 17-13 17m-9-38-10 42" stroke="#63f5d2" stroke-width="3" stroke-linecap="round"/></g>
      <g class="float-right"><rect x="478" y="57" width="100" height="85" rx="12" fill="#17243e" stroke="#9589ff" stroke-opacity=".6"/><circle cx="528" cy="100" r="23" stroke="#9589ff" stroke-width="2"/><path d="m517 100 8 8 15-17" stroke="#63f5d2" stroke-width="3" stroke-linecap="round"/></g>
      <path class="signal" d="M86 397h98l27 25h211l27-25h91" stroke="url(#art-line)" stroke-width="2" stroke-dasharray="8 10"/>
    </svg>`,
  styles: [`
    :host{display:block;width:100%}svg{width:100%;height:auto;overflow:visible}
    .window{animation:float 8s ease-in-out infinite}.float-left{animation:float 6s ease-in-out infinite reverse}.float-right{animation:float 7s ease-in-out infinite}
    .gem{transform-origin:416px 236px;animation:breathe 5s ease-in-out infinite}.signal{animation:travel 8s linear infinite}
    .orbit{transform-origin:320px 245px;animation:orbit 45s linear infinite}
    @keyframes float{50%{transform:translateY(-12px)}}@keyframes breathe{50%{transform:scale(.93);opacity:.6}}
    @keyframes travel{to{stroke-dashoffset:-180}}@keyframes orbit{to{transform:rotate(360deg)}}
    @media(prefers-reduced-motion:reduce){*{animation:none!important}}
    @media(max-width:800px){.orbit,.signal{animation:none}}
    :host-context(.motion-paused) *{animation-play-state:paused!important}
  `],
})
export class DevArt {}
