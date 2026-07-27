
import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove the old small button from the About section
old_btn = '''                                <div class="mt-8">
                                    <button onclick="openSocioModal()" class="btn-primary-premium w-full sm:w-auto text-lg px-8 group">
                                        Fazer-me Sócio
                                        <svg class="w-5 h-5 inline-block ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                        </svg>
                                    </button>
                                </div>'''
text = text.replace(old_btn, '')

# 2. Add the new CTA section before the footer
cta_section = '''
                <!-- Sócio CTA Section -->
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
                </section>
'''

if 'Torna-te Sócio do GCD Armil' not in text:
    text = text.replace('<footer class="bg-foreground', cta_section + '\n                <footer class="bg-foreground')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated CTA section applied!')
