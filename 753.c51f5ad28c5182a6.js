"use strict";(self.webpackChunkng_walkthrough=self.webpackChunkng_walkthrough||[]).push([[753],{753:(h,l,d)=>{d.r(l),d.d(l,{Add:()=>s});var m=d(467),n=d(68),p=function(u,e,a,r){var i,c=arguments.length,t=c<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)t=Reflect.decorate(u,e,a,r);else for(var f=u.length-1;f>=0;f--)(i=u[f])&&(t=(c<3?i(t):c>3?i(e,a,t):i(e,a))||t);return c>3&&t&&Object.defineProperty(e,a,t),t},o=function(u,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(u,e)};class s extends n.SmartContract{constructor(){super(...arguments),this.num=(0,n.State)()}init(){super.init(),this.num.set((0,n.Field)(1))}update(){var e=this;return(0,m.A)(function*(){const r=e.num.getAndRequireEquals().add(2);e.num.set(r)})()}}p([(0,n.state)(n.Field),o("design:type",Object)],s.prototype,"num",void 0),p([n.method,o("design:type",Function),o("design:paramtypes",[]),o("design:returntype",Promise)],s.prototype,"update",null)}}]);