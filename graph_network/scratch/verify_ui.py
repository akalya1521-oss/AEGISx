import urllib.request

base = 'http://127.0.0.1:8000'

# Check HTML structure
html = urllib.request.urlopen(base + '/').read().decode('utf-8')
assert '01 / Add Entity' in html
assert '02 / Add Relationship' in html
assert '03 / Relationship Path Finder' in html

ws_start = html.find('class="workspace"')
ws_end = html.find('</section>', ws_start)
op_pos = html.find('class="operations"')

print("Workspace start:", ws_start)
print("Workspace end:", ws_end)
print("Operations start:", op_pos)
assert op_pos > ws_end, "Operations grid must be positioned outside the workspace container"

# Check CSS rules
css = urllib.request.urlopen(base + '/static/styles.css').read().decode('utf-8')
assert 'repeat(3, minmax(280px, 1fr))' in css
assert 'width: 100%' in css

# Check JS logic
js = urllib.request.urlopen(base + '/static/app.js').read().decode('utf-8')
assert 'RAW API RESPONSE' in js
assert 'pathResultsContainer' in js
assert '/graph/path' in js

print("\n>>> ALL UI LAYOUT & RESULT CONTAINER VALIDATIONS PASSED! <<<")
