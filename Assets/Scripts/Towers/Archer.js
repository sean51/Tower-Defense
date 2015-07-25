#pragma strict

public class Archer extends Tower
{
	//Overwritten from Tower
	function Start()
	{
		health = 100;
		max_health = 100;
	}
	
	function increaseLevel()
	{
		var child : Transform = gameObject.transform.Find("Fire Projectile");
		child.GetComponent(TowerAttack).setDamage(child.GetComponent(TowerAttack).getDamage() * 2);
		if(level++ == 1)
		{
			child.GetComponent(TowerAttack).setHoming();
		}
		else
		{
			child.GetComponent(TowerAttack).setRapid();
		}
		mend(1);
	}
}