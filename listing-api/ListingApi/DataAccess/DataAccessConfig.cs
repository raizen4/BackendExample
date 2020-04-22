namespace ListingApi.DataAccess
{
    public static class DataAccessConfig
    {
        public const string ListingContainerName = "Listing";

        public const string ListingAuditContainerName = "ListingAudit";

        public const int SyntheticTimeToLiveSeconds = 60 * 60;

        public const int DefaultTimeToLiveSeconds = -1;
    }
}
