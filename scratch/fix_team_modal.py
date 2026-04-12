
import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern to find the broken img tags and fix them
# We want to replace the mess with a clean img tag
teams = [
    ("traquinas.jpg", "Traquinas"),
    ("infantis.jpg", "Infantis"),
    ("juvenis.jpg", "Juvenis"),
    ("seniores_futsal.jpg", "Séniores Futsal"),
    ("sen_futebol.jpg", "Séniores Futebol"),
    ("veteranos.jpg", "Veteranos")
]

for img_file, team_name in teams:
    # Find the block for this team and replace it entirely for safety
    pattern = rf'<img src="img/{img_file}" alt="Equipa {team_name}"[^>]+>'
    
    # Actually, let's just use a more surgical replacement to fix the double class and add onclick correctly
    # The previous script created something like: <img src="..." alt="..." onclick="..." class="..."\n class="...">
    
    bad_block_pattern = rf'<img src="img/{img_file}" alt="Equipa {team_name}" onclick="openTeamModal\(\'img/{img_file}\', \'{team_name}\'\)" class="[^"]+"[ \t\n]+class="[^"]+"'
    
    clean_tag = f'<img src="img/{img_file}" alt="Equipa {team_name}" onclick="openTeamModal(\'img/{img_file}\', \'{team_name}\')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"'
    
    text = re.sub(bad_block_pattern, clean_tag, text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed team card image tags in index.html')
