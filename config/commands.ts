interface Command {
  name: string;
  template: string;
}

const commands: Command[] = [
  {
    name: "impacket-wmiexec",
    template: "impacket-wmiexec {username}:{password}@{domain}",
  },
  {
    name: "impacket-psexec",
    template: "impacket-psexec {username}:{password}@{domain}",
  },
  {
    name: "impacket-smbexec",
    template: "impacket-psexec {username}:{password}@{domain}",
  },
];

export default commands;
