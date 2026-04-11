import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the broken div structure at the end of admin panel
# We want to keep exactly 3 closing divs after the admin tabs before the script
# 1 for the max-w-7xl container, 1 for min-h-screen, 1 for admin-panel-view.
# But wait, admin-tab-activities also has a closing div.
# So it should be: 
# </div> <!-- end of admin-tab-activities -->
# </div> <!-- end of max-w-7xl -->
# </div> <!-- end of min-h-screen -->
# </div> <!-- end of admin-panel-view -->

# Let's find the messed up block and replace it cleanly.
text = re.sub(r'</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*<script>', '</div></div></div></div><script>', text)
# If that's too specific, let's just clean up any sequence of 4+ closing divs before script
text = re.sub(r'(</div>\s*){4,}\s*<script>', '</div></div></div></div><script>', text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("HTML structure cleaned")
