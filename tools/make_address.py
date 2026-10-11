"""
Run on your own computer:  python make_address.py
Type your server IP and port. It prints the encrypted numbers to paste into the 3 files shown.
The real IP/port are never written to any file by this script.
"""
import random

ip = input("Server IP: ").strip()
port = int(input("Port: ").strip())

o = [int(x) for x in ip.split(".")]
assert len(o) == 4 and all(0 <= x <= 255 for x in o), "Invalid IP"
assert 1 <= port <= 65535, "Invalid port"

k = [random.randint(1, 255) for _ in range(4)]
enc_ip = [o[i] ^ k[i] for i in range(4)]
enc_port = [(port >> 8) ^ k[2], (port & 255) ^ k[3]]
z = [random.randint(0, 255) for _ in range(3)]

print("\n--- src/helpers/colorMath.ts ---")
print(f"export const KA = {[k[0], k[1]]};")
print(f"export const ZA = {z[0]};")
print("\n--- src/helpers/dateFormat.ts ---")
print(f"export const KB = {[k[2], k[3]]};")
print(f"export const ZB = {z[1]};")
print("\n--- src/helpers/sizeUnits.ts ---")
print(f"export const VA = {enc_ip};")
print(f"export const VB = {enc_port};")
print(f"export const ZC = {z[2]};")
