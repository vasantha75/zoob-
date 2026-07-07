import os
import glob
import re

frontend_dir = r"c:\Users\sreek\Desktop\Company Proj\Zoob-AI-HRMS\frontend\app"

for root, _, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = re.sub(r'"http://127\.0\.0\.1:8001([^"]*)"', r'"{}"'.format("http://127.0.0.1:8000") + r'\1', content)
            
            if new_content != content:
                print(f"Updated {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
