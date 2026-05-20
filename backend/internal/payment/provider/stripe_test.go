package provider

import (
	"reflect"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/payment"
)

func TestResolveStripeMethodTypesIncludesKakaoPay(t *testing.T) {
	t.Parallel()

	got := resolveStripeMethodTypes("card,kakao_pay,link")
	want := []string{"card", "kakao_pay", "link"}

	if !reflect.DeepEqual(got, want) {
		t.Fatalf("resolveStripeMethodTypes() = %v, want %v", got, want)
	}
}

func TestStripeSupportedTypesKeepsRegistryEntryScopedToStripe(t *testing.T) {
	t.Parallel()

	prov, err := NewStripe("stripe-1", map[string]string{
		"secretKey":      "sk_test_123",
		"publishableKey": "pk_test_123",
		"webhookSecret":  "whsec_123",
		"currency":       "KRW",
	})
	if err != nil {
		t.Fatalf("NewStripe() error = %v", err)
	}

	got := prov.SupportedTypes()
	want := []payment.PaymentType{payment.TypeStripe}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("SupportedTypes() = %v, want %v", got, want)
	}
}
