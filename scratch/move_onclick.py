
import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

teams = [
    ("traquinas.jpg", "Traquinas"),
    ("infantis.jpg", "Infantis"),
    ("juvenis.jpg", "Juvenis"),
    ("seniores_futsal.jpg", "Séniores Futsal"),
    ("sen_futebol.jpg", "Séniores Futebol"),
    ("veteranos.jpg", "Veteranos")
]

for img_file, team_name in teams:
    # 1. Remove onclick and cursor-pointer from img
    text = text.replace(f'onclick="openTeamModal(\'img/{img_file}\', \'{team_name}\')" ', '')
    text = text.replace(' cursor-pointer"', '"')
    
    # 2. Add onclick and cursor-pointer to the parent premium-card
    # We find the premium-card that precedes this image
    # For safety, let's replace the whole card block
    
    pattern = rf'<div class="premium-card overflow-hidden group">\s*<div class="relative h-56 overflow-hidden">\s*<img src="img/{img_file}"'
    replacement = f'<div class="premium-card overflow-hidden group cursor-pointer" onclick="openTeamModal(\'img/{img_file}\', \'{team_name}\')">\n                        <div class="relative h-56 overflow-hidden">\n                            <img src="img/{img_file}"'
    
    text = re.sub(pattern, replacement, text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Moved onclick handlers to team card containers in index.html')
