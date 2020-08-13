import hashlib

def crack_sha1_hash(hash, use_salts = False):
  passwords_list = open("top-10000-passwords.txt", "r")

  for password in passwords_list:
    pwd = password.strip()
    if use_salts:
      with open("known-salts.txt", "r") as salts_list:
        for salt in salts_list:
          s = salt.strip()

          # It is 'append OR prepend', not 'append AND prepend'!!!!!
          if hash == hashlib.sha1((pwd + s).encode("utf-8")).hexdigest():
            return pwd
          elif hash == hashlib.sha1((s + pwd).encode("utf-8")).hexdigest():
            return pwd
    else:
      if hash == hashlib.sha1(pwd.encode("utf-8")).hexdigest():
        return pwd  
  
  return 'PASSWORD NOT IN DATABASE'