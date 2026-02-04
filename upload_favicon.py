import requests
import base64

# Supabase config
SUPABASE_URL = "https://djpjaktzstbcwcrzfcun.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcGpha3R6c3RiY3djcnpmY3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMzU2NzcsImV4cCI6MjA1MjgxMTY3N30.eBiKKPEDLYjnJZGvfPqGQQDQQXzZjmPIjGCJZZLsWxE"

# Ler o favicon
with open('public/favicon.svg', 'rb') as f:
    file_content = f.read()

# Upload para Supabase Storage
url = f"{SUPABASE_URL}/storage/v1/object/store-assets/favicon.svg"
headers = {
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "image/svg+xml",
    "x-upsert": "true"
}

print("📤 Fazendo upload do favicon.svg...")
response = requests.post(url, headers=headers, data=file_content)

if response.status_code in [200, 201]:
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/store-assets/favicon.svg"
    print("✅ Upload concluído!")
    print(f"🔗 URL pública: {public_url}")
else:
    print(f"❌ Erro: {response.status_code}")
    print(response.text)
