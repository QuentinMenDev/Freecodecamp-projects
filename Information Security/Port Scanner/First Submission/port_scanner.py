import socket, time
from common_ports import *

def lookup(addr):
  try:
    return socket.gethostbyaddr(addr)
  except socket.herror:
    return 'None', 'None', 'None'

def get_open_ports(target, port_range, verbose = False):
  open_ports = []

  # Check first if the target is an ip or a url and if it is valid.
  if target.replace('.', '').isnumeric():
    try:
      host_ip = target
      name, alias, addresslist = lookup(host_ip)
    except:
      return 'Error: Invalid IP address'
  else:
    try:
      host_ip = socket.gethostbyname(target)
      name, alias, addresslist = lookup(host_ip)
    except:
      return 'Error: Invalid hostname'
  
  if name == 'None':
    text = 'Open ports for ' + host_ip + '\n' + 'PORT     SERVICE'
  else:
    text = 'Open ports for ' + name + ' (' + host_ip + ')\n' + 'PORT     SERVICE'

  for port in range(port_range[0], port_range[1] + 1):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(.9)
    resp = s.connect_ex((host_ip, port))

    if resp == 0:
      open_ports.append(port)
      text += '\n' + str(port) + ' ' * (9 - len(str(port))) + ports_and_services[port]
    
    s.close()
  print(open_ports)
  print(text)

  if verbose:
    return text
  else:
    return(open_ports)