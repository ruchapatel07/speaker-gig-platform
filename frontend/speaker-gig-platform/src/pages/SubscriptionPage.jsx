import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const INITIAL_PLANS = [
  { id: "basic", name: "Basic", quota: "5 Applications", price: "$19", applicationsLimit: 5 },
  { id: "pro", name: "Professional", quota: "15 Applications", price: "$49", applicationsLimit: 15, popular: true },
  { id: "enterprise", name: "Enterprise", quota: "Unlimited Applications", price: "$99", applicationsLimit: 999 },
];

export default function SubscriptionPage({ onNavigate, onLogout }) {
  const [currentPlanId, setCurrentPlanId] = useState("basic");
  const [usedApplications, setUsedApplications] = useState(2);
  const [selectedPlanModal, setSelectedPlanModal] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const currentPlan = INITIAL_PLANS.find((p) => p.id === currentPlanId) || INITIAL_PLANS[0];
  const limit = currentPlan.applicationsLimit;
  const percent = Math.min(100, Math.round((usedApplications / limit) * 100));

  const handleConfirmUpgrade = (plan) => {
    setCurrentPlanId(plan.id);
    setSelectedPlanModal(null);
    setSuccessMessage(`Successfully updated your subscription to ${plan.name} Plan!`);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleRenew = () => {
    setUsedApplications(0);
    setSuccessMessage("Subscription renewed! Application credits have been reset.");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="subscription" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="app-main">
        <div className="app-main-header">
          <div>
            <h1>Subscription & Quotas</h1>
            <p>Manage your application quota, billing tiers, and renewals.</p>
          </div>
        </div>

        {successMessage && (
          <div className="field-success" style={{ marginTop: "16px", padding: "10px 16px", width: "100%" }}>
            ✓ {successMessage}
          </div>
        )}

        <div className="subscription-grid">
          <div className="subscription-usage-card">
            <p className="subscription-label">Your Current Plan</p>
            <p className="subscription-plan-name">{currentPlan.name} Plan</p>
            <p className="subscription-usage-value">
              {usedApplications}
              <span>/{limit === 999 ? "∞" : limit}</span>
            </p>
            <p className="subscription-sub">Applications Used This Cycle</p>
            <div className="subscription-progress-track">
              <div
                className="subscription-progress-fill"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="subscription-sub" style={{ marginTop: "8px" }}>
              {limit === 999
                ? "Unlimited applications remaining"
                : `${Math.max(0, limit - usedApplications)} applications remaining`}
            </p>
            <button
              className="btn btn-primary btn-full"
              onClick={handleRenew}
            >
              Reset / Renew Cycle
            </button>
          </div>

          {INITIAL_PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            return (
              <div
                key={plan.id}
                className={`subscription-plan-card ${
                  plan.popular ? "subscription-plan-popular" : ""
                }`}
              >
                {plan.popular && <span className="subscription-badge">Popular</span>}
                <p className="subscription-label">{plan.name}</p>
                <p className="subscription-plan-name">{plan.quota}</p>
                <p className="subscription-sub">per month</p>
                <p className="subscription-price">
                  {plan.price}<span>/month</span>
                </p>
                <button
                  className={`btn btn-full ${
                    isCurrent
                      ? "btn-ghost"
                      : plan.popular
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                  disabled={isCurrent}
                  onClick={() => setSelectedPlanModal(plan)}
                >
                  {isCurrent ? "Current Plan ✓" : `Switch to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal for upgrading / switching plan */}
        {selectedPlanModal && (
          <div className="modal-backdrop" onClick={() => setSelectedPlanModal(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Upgrade to {selectedPlanModal.name} Plan</h2>
                <button
                  className="modal-close-btn"
                  onClick={() => setSelectedPlanModal(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: "#334155", fontSize: "14px", lineHeight: "1.6" }}>
                  You are about to switch your active subscription to the{" "}
                  <strong>{selectedPlanModal.name}</strong> tier.
                </p>
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", fontSize: "14px" }}>
                  <p><strong>Monthly Pricing:</strong> {selectedPlanModal.price}/month</p>
                  <p style={{ marginTop: "6px" }}><strong>Application Quota:</strong> {selectedPlanModal.quota}</p>
                  <p style={{ marginTop: "6px" }}><strong>Includes:</strong> Direct organizer outreach, verified speaker badge & analytics</p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setSelectedPlanModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleConfirmUpgrade(selectedPlanModal)}
                >
                  Confirm & Activate Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
