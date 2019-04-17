CREATE VIEW [dbo].[PendingActivities] AS
SELECT E.InstanceId, E.Title, IE.ChildId, E.Responsible
FROM [dbo].[Event] AS E LEFT JOIN [dbo].[InstanceExtension] AS IE
	ON E.InstanceId = IE.InstanceId
WHERE E.IsPending = 1
	AND E.IsEnabled = 1
	AND E.isOpen = 1