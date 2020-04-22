using System;

namespace ListingApi.Models
{
    public class ComplianceChecks
    {
        public bool ConfirmedId { get; set; }

        public bool ConfirmedLandRegistryOwnership { get; set; }

        public string LandRegistryDocsUri { get; set; }

        public bool ConfirmedCorrectData { get; set; }

        public DateTime AgencyAgreementSignedDate { get; set; }

        public int AgencyAgreementPeriod { get; set; }

        public DateTime? CompetitorAgreementExpiry { get; set; }
    }
}
