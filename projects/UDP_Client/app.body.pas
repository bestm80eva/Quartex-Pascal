unit app.body;

interface

uses
  qtx.sysutils,
  qtx.classes,
  qtx.node.path,
  qtx.node.os,
  qtx.node.events,
  qtx.logfile,
  qtx.node.net,
  qtx.node.udp,
  qtx.node.application;


type

  // Inherit out an UDP server object
  TUDPServer = class(TQTXUDPServer)
  protected
    // Implement the dispatch method so we can act on incomming messages.
    // Please note that UDP is a connection-less protocol
    procedure Dispatch(Message: variant; Remote: JUDPAddress); override;
  end;

  // Our application object
  TNodeApplication = class(TQTXApplication)
  private
    FServer:  TUDPServer;
  public
    property  Server: TQTXUDPServer read FServer;
    procedure Execute;
  end;

implementation

//#############################################################################
// TUDPServer
//#############################################################################

procedure TUDPServer.Dispatch(Message: variant; Remote: JUDPAddress);
begin
  // A message was received, output the data to console.
  // You might want to define an OnMessageReceived event, or use the
  // Ragnarok protocol objects to deal with JSON based messages.
  // But there are no rules, you can create your own protocol.
  Writeln(&Message);
end;

//#############################################################################
// TNodeApplication
//#############################################################################

procedure TNodeApplication.Execute;
begin
  // Create our server instance & setup values
  FServer := TUDPServer.Create();
  FServer.Port := 1881;
  FServer.Address := GetMachineIP();

  // Start the server. Provide a callback method to deal with
  // the result of the call. You can also send in any value as the first
  // parameter, and you get it back in the callback as the TagValue parameter.
  // This is a common technique for passing object references and data into
  // a call process, where it helps to identify the data later
  FServer.Start(nil, procedure (Sender: TObject; TagValue: variant; Error: Exception)
  begin
    // Check if there is an exception object (failed)
    if Error <> nil then
    begin
      Writeln('UDP Server failed to start:');
      writeln(error.message);
      exit;
    end;

    // If there was no exception, the server is started and ready
    // to receive messages
    writelnF("UDP Server started, listening on %s:%d", [FServer.Address, FServer.Port]);
  end);
end;




end.
