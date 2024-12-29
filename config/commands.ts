interface Command {
  name: string;
  template: string;
  authType: "password" | "ntlmHash";
}

const commands: Command[] = [
  {
    name: "impacket-wmiexec",
    template:
      "impacket-wmiexec '{domain}'/'{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    name: "impacket-psexec",
    template:
      "impacket-psexec '{domain}'/'{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    name: "impacket-smbexec",
    template:
      "impacket-smbexec '{domain}'/'{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    name: "Evil-WinRM",
    template: "evil-winrm -u '{username}' -p '{password}' -i '{targetHost}'",
    authType: "password",
  },
  {
    name: "impacket-wmiexec (NTLM)",
    template:
      "impacket-wmiexec '{domain}'/'{username}'@'{targetHost}' -hashes '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    name: "impacket-psexec (NTLM)",
    template:
      "impacket-psexec '{domain}'/'{username}'@'{targetHost}' -hashes '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    name: "impacket-smbexec (NTLM)",
    template:
      "impacket-smbexec '{domain}'/'{username}'@'{targetHost}' -hashes '{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    name: "Evil-WinRM (NTLM)",
    template: "evil-winrm -u '{username}' -H '{ntlmHash}' -i '{targetHost}'",
    authType: "ntlmHash",
  },
];

export default commands;
