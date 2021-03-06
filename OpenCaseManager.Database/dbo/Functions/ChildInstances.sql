-- =============================================
-- Author: Thais Kure Corneliusen  
-- Create date: 14-04-2019
-- Description:	Get instances for a single child
-- =============================================
CREATE FUNCTION [dbo].[ChildInstances](@UserId INT)
RETURNS TABLE
AS
	RETURN (
	           SELECT I.Id, I.Title, U.Name,
					  I.NextDeadline, I.IsOpen,
					  I.Description, P.Title AS Process,
					  C.Id AS ChildId,
					  (SELECT MAX(CreationDate)
						FROM dbo.JournalHistory
						WHERE I.Id = JournalHistory.InstanceId) AS LastUpdated,
						(SELECT COUNT(*)
							FROM dbo.Event
							WHERE IsEnabled = 1
								AND IsPending = 1
								AND InstanceId = I.Id
								AND Responsible = @UserId) AS PendingAndEnabled,
						(SELECT CASE 
									WHEN COUNT(*) > 0
										THEN 'true'
										ELSE 'false'
									END AS PendingBool
							FROM dbo.Event
							WHERE IsPending = 1
								AND InstanceId = I.Id
								AND Responsible = @UserId) AS Pending
				FROM dbo.Instance AS I, dbo.InstanceExtension AS IE, dbo.Child AS C, dbo.[User] AS U, dbo.Process AS P
				WHERE I.Id = IE.InstanceId
					AND IE.ChildId = C.Id
					AND I.Responsible = U.Id
					AND I.GraphId = P.GraphId
			)