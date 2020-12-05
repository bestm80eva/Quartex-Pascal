program NodeTest;

uses
  qtx.sysutils,
  qtx.classes,
  qtx.time,
  app.body;

var
  AppInstance: TNodeApplication;

begin
  try
    AppInstance := TNodeApplication.Create();
    AppInstance.Execute();
  except
    on e: exception do
    writeln(e.message);
  end;
end.
