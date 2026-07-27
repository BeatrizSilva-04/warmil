
import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

ugly_section = '''                <!-- Sócio CTA Section -->
                <section class="py-24 relative overflow-hidden bg-primary text-white">
                    <div class="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518605368461-1e1e1dce1559?auto=format&fit=crop&q=80')] bg-cover bg-center bg-fixed"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <span class="text-sm font-bold tracking-[0.3em] text-white/70 uppercase mb-4 block">Faz parte da Família</span>
                        <h2 class="font-montserrat font-black text-5xl md:text-6xl mb-6 tracking-tighter">Torna-te Sócio do GCD Armil</h2>
                        <p class="font-open-sans text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Apoia o clube da tua terra e ajuda-nos a formar as próximas gerações de atletas. 
                            Juntos somos mais fortes!
                        </p>
                        <button onclick="openSocioModal()" class="bg-white text-primary px-10 py-5 rounded-full font-black text-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] inline-flex items-center group">
                            Quero Ser Sócio
                            <svg class="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                        </button>
                    </div>
                </section>'''

beautiful_card = '''                <!-- Sócio CTA Card -->
                <section class="py-16 bg-muted/30">
                    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="premium-card bg-foreground text-white p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                            <!-- Subtle decorative elements -->
                            <div class="absolute top-0 right-0 w-64 h-64 bg-primary opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                            <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                            
                            <div class="md:w-2/3 relative z-10 text-center md:text-left">
                                <h2 class="font-montserrat font-black text-4xl md:text-5xl mb-4 tracking-tighter">Junta-te à equipa.</h2>
                                <p class="font-open-sans text-gray-300 text-lg md:text-xl">
                                    Apoia o GCD Armil, ajuda-nos a formar os atletas do futuro e usufrui de vantagens exclusivas ao tornares-te sócio oficial.
                                </p>
                            </div>
                            
                            <div class="md:w-1/3 relative z-10 flex justify-center md:justify-end">
                                <button onclick="openSocioModal()" class="bg-white text-foreground px-8 py-4 rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center group">
                                    Fazer-me Sócio
                                    <svg class="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>'''

text = text.replace(ugly_section, beautiful_card)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated to a beautiful card layout')
