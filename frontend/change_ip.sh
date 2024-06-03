file_path="/frontend/src/Resources.js"
sed -i "s|export let ip = \"http://localhost:5000\";|export let ip = \"http://192.168.0.105:5000\";|g" "$file_path"
sed -i "s|let ip = \"http://localhost:5000\";|let ip = \"http://$SERVER_IP:5000\";|g" "$file_path"

if grep -q "export let ip = \"http://$SERVER_IP:5000\";" "$file_path"; then
  echo "IP address successfully updated to http://192.168.0.105:5000 in $file_path"
else
  echo "Failed to update IP address in $file_path"
fi