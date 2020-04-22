using System;
using System.Collections.Generic;
using ListingApi.Interfaces.DataAccess;
using ListingApi.Models;
using ListingApi.Models.Cosmos;

namespace ListingApi.UnitTests.UseCases.when_getting_the_last_event_for_a_listing
{
    public static class TestHelper
    {
        public static string ValidListingId => "d385e0c1-0303-4afd-b693-a033871bf194";
        public static string ValidListingUri => $"/listings/{ValidListingId}/audits/{AuditEventType.Deleted}";
        
        public static AuditEvent eventRetrieved = new AuditEvent
        {
            ListingId = ValidListingId,
            EventType = AuditEventType.Deleted,
            Id = Guid.NewGuid().ToString(),
            DateAdded = DateTime.Now,
            UserId="A31231FEER4132231",
            Username = "Bob Boromir"
        };
    }
}