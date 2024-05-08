# Nest.js Clean Architecture

## Generate RS256 Key Pair

To generate a new RSA key pair, run the following commands:

```bash
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

To encode the keys in base64, run the following commands:

```bash
base64 -i ./private_key.pem -o private_key.txt
base64 -i ./public_key.pem -o public_key.txt
```

Add the content of the `private_key.txt` and `public_key.txt` files to the `.env` file.
