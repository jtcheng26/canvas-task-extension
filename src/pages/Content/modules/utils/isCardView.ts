export default function isCardView(): boolean {
  const links = Array.from(
    document.getElementsByClassName('ic-DashboardCard__link')
  );

  return links.length > 0;
}
