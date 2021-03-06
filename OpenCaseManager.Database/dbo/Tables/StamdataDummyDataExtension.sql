CREATE TABLE [dbo].[StamdataDummyDataExtension] (
    [Id]				INT             IDENTITY (1, 1) NOT NULL,
    [ChildId]			INT				NOT NULL,
    [StamdataId]		INT			    NOT NULL,
    [Relation]			nvarchar(100)   NOT NULL
    CONSTRAINT [PK_StamdataDummyDataExtension] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_StamdataDummyDataExtension_ChildId] FOREIGN KEY ([ChildId]) REFERENCES [dbo].[Child] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_StamdataDummyDataExtension_StamdataId] FOREIGN KEY ([StamdataId]) REFERENCES [dbo].[StamdataDummyData] ([Id]) ON DELETE CASCADE
);