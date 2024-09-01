set OPENSSL_CONF=C:\OpenSSL\bin\openssl.cfg
C:\OpenSSL\bin\openssl pkcs12 -export -out CertIIS.pfx -inkey privkey.pem -in cert.pem
pause