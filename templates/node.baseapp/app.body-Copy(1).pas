unit app.body;

interface

uses
  qtx.sysutils,
  qtx.classes,
  qtx.node.path,
  qtx.node.os,
  qtx.node.filesystem,
  qtx.node.console,
  qtx.node.events,
  qtx.logfile,
  qtx.node.net,
  qtx.node.http,
  qtx.node.application;


type

  TNodeApplication = class(TQTXApplication)
  private
    FServer:  JServer;
    procedure HandleRequest(request: JServerRequest; response: JServerResponse);
  public
    property  Server: JServer read FServer;
    procedure Execute;
  end;

implementation

procedure TNodeApplication.Execute;
begin
  // Create a http server
  FServer := NodeJSHttpAPI().createServer( @HandleRequest );

  // Listen on port 8090
  FServer.listen(8090);

  writeln("Server listening on port 8090");
end;

procedure TNodeApplication.HandleRequest(request: JServerRequest; response: JServerResponse);
begin
  writelnF("Received HTTP request for [%s] from [%s]", [request.url, request.connection.remoteAddress]);
  response.end("<html><body>Hello world!</body></html>");
end;

end.
